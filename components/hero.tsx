import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-10 pt-14 text-center md:pb-16 md:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          100% in your browser · No uploads, no tracking
        </span>

        <h1 className="mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Turn any PDF into{" "}
          <span className="font-serif italic text-accent">crisp images</span> in seconds.
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
          Drop a PDF, choose PNG, JPG, or WebP, and download every page as a high-quality image.
          All conversion happens locally — your files never leave your device.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Multi-page support
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Up to 4× resolution
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Batch ZIP export
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Free forever
          </span>
        </div>
      </div>
    </section>
  )
}
