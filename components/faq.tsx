import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Are my PDFs uploaded to a server?",
    a: "No. Pixelpress uses PDF.js to read and render your PDF directly inside your browser. The file never leaves your device.",
  },
  {
    q: "What file size limits should I expect?",
    a: "There is no hard limit, but very large PDFs (hundreds of pages or hi-res scans) may slow down your browser. For huge documents, try a lower resolution first.",
  },
  {
    q: "Which image format should I pick?",
    a: "Pick PNG for lossless, screenshot-perfect output. JPG is great when file size matters and the page is photographic. WebP gives the best balance of quality and size for the modern web.",
  },
  {
    q: "Can I convert password-protected PDFs?",
    a: "Pixelpress does not support encrypted PDFs at the moment. Remove the password in your PDF reader first, then convert.",
  },
  {
    q: "Why does higher resolution take longer?",
    a: "We render each page on a canvas at the resolution you choose. 4× resolution means 16× the pixels of the standard option, so it takes proportionally longer.",
  },
  {
    q: "Is Pixelpress really free?",
    a: "Yes. There are no accounts, no usage caps, and no watermarks. Use it as much as you like.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="border-b border-border/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr_2fr] md:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            FAQ
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Common <span className="font-serif italic">questions</span>.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Still curious about how Pixelpress handles your files? Here's what most
            people want to know.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
