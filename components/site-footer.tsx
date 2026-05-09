import { FileImage } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileImage className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-semibold">Pixelpress</span>
          <span className="ml-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} — Made for people who hate slow tools.
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <a href="#convert" className="hover:text-foreground">
            Convert
          </a>
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  )
}
