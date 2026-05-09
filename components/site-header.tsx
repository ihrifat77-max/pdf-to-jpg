import Link from "next/link"
import { FileImage, Github } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileImage className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Pixelpress
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#convert" className="transition-colors hover:text-foreground">
            Convert
          </a>
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#faq" className="transition-colors hover:text-foreground">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <a href="#convert">Try it</a>
          </Button>
          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="View source on GitHub"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Star</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
