"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Download,
  FileText,
  ImageIcon,
  Loader2,
  Trash2,
  UploadCloud,
  Wand2,
  X,
} from "lucide-react"
import JSZip from "jszip"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

type ImageFormat = "png" | "jpeg" | "webp"

type RenderedPage = {
  index: number
  url: string
  blob: Blob
  width: number
  height: number
}

const FORMAT_LABEL: Record<ImageFormat, string> = {
  png: "PNG · Lossless",
  jpeg: "JPG · Smaller",
  webp: "WebP · Modern",
}

const FORMAT_MIME: Record<ImageFormat, string> = {
  png: "image/png",
  jpeg: "image/jpeg",
  webp: "image/webp",
}

const FORMAT_EXT: Record<ImageFormat, string> = {
  png: "png",
  jpeg: "jpg",
  webp: "webp",
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

export function PdfConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<ImageFormat>("png")
  const [scale, setScale] = useState<number>(2)
  const [quality, setQuality] = useState<number>(0.92)
  const [pages, setPages] = useState<RenderedPage[]>([])
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "loading" | "converting" | "done" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Cleanup blob URLs on unmount / reset
  useEffect(() => {
    return () => {
      pages.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [pages])

  const resetPages = useCallback(() => {
    setPages((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.url))
      return []
    })
  }, [])

  const handleFile = useCallback(
    (incoming: File | null | undefined) => {
      if (!incoming) return
      if (incoming.type !== "application/pdf" && !incoming.name.toLowerCase().endsWith(".pdf")) {
        setErrorMsg("That file doesn't look like a PDF. Please upload a .pdf file.")
        return
      }
      setErrorMsg(null)
      resetPages()
      setProgress(0)
      setStatus("idle")
      setFile(incoming)
    },
    [resetPages],
  )

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragActive(false)
      const dropped = e.dataTransfer.files?.[0]
      handleFile(dropped)
    },
    [handleFile],
  )

  const convert = useCallback(async () => {
    if (!file) return
    setStatus("loading")
    setErrorMsg(null)
    setProgress(0)
    resetPages()

    try {
      // Dynamically import pdf.js on the client
      const pdfjsLib = await import("pdfjs-dist")
      // Configure worker via CDN — works without bundler config
      const version = pdfjsLib.version as string
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`

      const buffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: buffer })
      const pdf = await loadingTask.promise

      setStatus("converting")
      const total = pdf.numPages
      const rendered: RenderedPage[] = []

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement("canvas")
        canvas.width = Math.ceil(viewport.width)
        canvas.height = Math.ceil(viewport.height)
        const context = canvas.getContext("2d")
        if (!context) throw new Error("Could not create canvas context")

        // White background for JPG (which has no transparency)
        if (format === "jpeg") {
          context.fillStyle = "#ffffff"
          context.fillRect(0, 0, canvas.width, canvas.height)
        }

        await page.render({
          canvasContext: context,
          viewport,
          canvas,
        } as Parameters<typeof page.render>[0]).promise

        const blob: Blob = await new Promise((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))),
            FORMAT_MIME[format],
            format === "png" ? undefined : quality,
          )
        })

        const url = URL.createObjectURL(blob)
        rendered.push({
          index: i,
          url,
          blob,
          width: canvas.width,
          height: canvas.height,
        })

        setProgress(Math.round((i / total) * 100))
        // Allow the UI to breathe between heavy renders
        await new Promise((r) => setTimeout(r, 0))
      }

      setPages(rendered)
      setStatus("done")
    } catch (err) {
      console.log("[v0] PDF conversion error:", err)
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong while converting.")
      setStatus("error")
    }
  }, [file, format, quality, scale, resetPages])

  const downloadOne = (p: RenderedPage) => {
    const baseName = file?.name.replace(/\.pdf$/i, "") ?? "page"
    const a = document.createElement("a")
    a.href = p.url
    a.download = `${baseName}-page-${String(p.index).padStart(3, "0")}.${FORMAT_EXT[format]}`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const downloadAll = async () => {
    if (!pages.length) return
    const baseName = file?.name.replace(/\.pdf$/i, "") ?? "pdf-images"
    const zip = new JSZip()
    const folder = zip.folder(baseName) ?? zip
    for (const p of pages) {
      folder.file(`${baseName}-page-${String(p.index).padStart(3, "0")}.${FORMAT_EXT[format]}`, p.blob)
    }
    const content = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(content)
    const a = document.createElement("a")
    a.href = url
    a.download = `${baseName}-images.zip`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setFile(null)
    resetPages()
    setProgress(0)
    setStatus("idle")
    setErrorMsg(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const isWorking = status === "loading" || status === "converting"

  return (
    <section id="convert" className="mx-auto w-full max-w-6xl px-4 py-10 md:py-16">
      <Card className="overflow-hidden border-2 border-foreground/10 bg-card p-0 shadow-[0_30px_60px_-30px_rgba(20,30,60,0.25)]">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_1fr]">
          {/* Left column: upload + options */}
          <div className="border-b border-border p-6 md:p-10 lg:border-b-0 lg:border-r">
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
                1
              </span>
              Upload your PDF
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              className={cn(
                "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors",
                dragActive
                  ? "border-accent bg-accent/5"
                  : "border-border bg-secondary/40 hover:border-accent/60 hover:bg-secondary/70",
              )}
            >
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => handleFile(e.target.files?.[0])}
                aria-label="Upload PDF file"
              />
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-base font-medium text-foreground">
                {file ? "Drop another PDF to replace" : "Drop a PDF here"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or <span className="text-accent underline-offset-2 group-hover:underline">browse from your device</span>
              </p>
              <p className="mt-3 text-xs text-muted-foreground">Files are processed locally — never uploaded.</p>
            </div>

            {file && (
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
                <FileText className="h-5 w-5 shrink-0 text-accent" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {errorMsg && (
              <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errorMsg}
              </p>
            )}

            <div className="mt-8 mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
                2
              </span>
              Choose your output
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="format" className="text-xs font-semibold uppercase tracking-wider">
                  Format
                </Label>
                <Select value={format} onValueChange={(v) => setFormat(v as ImageFormat)}>
                  <SelectTrigger id="format" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(FORMAT_LABEL) as ImageFormat[]).map((f) => (
                      <SelectItem key={f} value={f}>
                        {FORMAT_LABEL[f]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider">
                  Resolution
                  <span className="ml-2 font-mono text-[11px] font-normal text-muted-foreground">
                    {scale.toFixed(1)}×
                  </span>
                </Label>
                <Slider
                  value={[scale]}
                  min={1}
                  max={4}
                  step={0.5}
                  onValueChange={(v) => setScale(v[0] ?? 2)}
                  className="py-3"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Standard</span>
                  <span>Ultra</span>
                </div>
              </div>

              {format !== "png" && (
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider">
                    Quality
                    <span className="ml-2 font-mono text-[11px] font-normal text-muted-foreground">
                      {Math.round(quality * 100)}%
                    </span>
                  </Label>
                  <Slider
                    value={[quality]}
                    min={0.5}
                    max={1}
                    step={0.02}
                    onValueChange={(v) => setQuality(v[0] ?? 0.92)}
                    className="py-3"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={convert}
                disabled={!file || isWorking}
                className="h-12 flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isWorking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {status === "loading" ? "Reading PDF…" : `Converting ${progress}%`}
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Convert to {format.toUpperCase()}
                  </>
                )}
              </Button>
              {pages.length > 0 && !isWorking && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearAll}
                  className="h-12 gap-2 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {isWorking && (
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Right column: results */}
          <div className="bg-secondary/40 p-6 md:p-10">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
                  3
                </span>
                Download
              </div>
              {pages.length > 0 && (
                <Button
                  type="button"
                  size="sm"
                  onClick={downloadAll}
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Download className="h-4 w-4" />
                  All as ZIP
                </Button>
              )}
            </div>

            {pages.length === 0 ? (
              <div className="flex h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <p className="text-base font-medium text-foreground">
                  {isWorking ? "Rendering pages…" : "Your images will appear here"}
                </p>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  {isWorking
                    ? "We're rendering each page at your chosen resolution."
                    : "Upload a PDF and hit convert to see page-by-page previews."}
                </p>
              </div>
            ) : (
              <div className="grid max-h-[560px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
                {pages.map((p) => (
                  <figure
                    key={p.index}
                    className="group overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.url || "/placeholder.svg"}
                        alt={`Page ${p.index} preview`}
                        className="h-full w-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => downloadOne(p)}
                        className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/40 group-hover:opacity-100"
                        aria-label={`Download page ${p.index}`}
                      >
                        <span className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow">
                          <Download className="h-4 w-4" />
                          Download
                        </span>
                      </button>
                    </div>
                    <figcaption className="flex items-center justify-between border-t border-border px-3 py-2 text-xs">
                      <span className="font-medium text-foreground">Page {p.index}</span>
                      <span className="font-mono text-muted-foreground">
                        {p.width}×{p.height}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </section>
  )
}
