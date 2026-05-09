import { Lock, Zap, Layers, Settings2, Image as ImageIcon, Archive } from "lucide-react"

const features = [
  {
    icon: Lock,
    title: "Private by design",
    description:
      "Your PDF is parsed and rendered entirely in your browser. Nothing is uploaded to a server.",
  },
  {
    icon: Zap,
    title: "Fast rendering",
    description:
      "Powered by PDF.js with hardware-accelerated canvas, so even long documents convert quickly.",
  },
  {
    icon: Layers,
    title: "Every page, separately",
    description:
      "Each page becomes its own image with consistent dimensions — perfect for slides or proofs.",
  },
  {
    icon: Settings2,
    title: "Tunable output",
    description:
      "Pick PNG, JPG, or WebP, then dial in resolution and quality to match your use case.",
  },
  {
    icon: ImageIcon,
    title: "Sharp at any scale",
    description:
      "Render up to 4× the original resolution for retina displays and print-ready exports.",
  },
  {
    icon: Archive,
    title: "Batch download",
    description:
      "Grab a single page or download the whole PDF as a tidy ZIP archive in one click.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            What's inside
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            A focused tool that just{" "}
            <span className="font-serif italic">does the job</span>.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            No accounts, no quotas, no watermarks. Just a thoughtful PDF to image
            converter built around speed, privacy, and quality.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
