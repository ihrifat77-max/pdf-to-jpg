import { Faq } from "@/components/faq"
import { Features } from "@/components/features"
import { Hero } from "@/components/hero"
import { PdfConverter } from "@/components/pdf-converter"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <Hero />
      <PdfConverter />
      <Features />
      <Faq />
      <SiteFooter />
    </main>
  )
}
