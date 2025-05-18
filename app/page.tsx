import Link from "next/link"
import { Instagram } from "lucide-react"
import Image from "next/image"
import PhotoGallery from "@/components/photo-gallery"
import MobileMenu from "@/components/mobile-menu"
import AnimatedSection from "@/components/animated-section"
import ParallaxSection from "@/components/parallax-section"
import ContactForm from "@/components/contact-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="bg-white z-50 container mx-auto px-4 py-8 flex justify-between items-center">
        <h1 className="text-xl font-light tracking-wider">NICOLAS KLEIN</h1>
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-sm border-b border-black transition-none">
            home
          </Link>
          <Link href="/portfolio" className="text-sm hover:border-b hover:border-black transition-none">
            portfolio
          </Link>
          <Link href="/pricing" className="text-sm hover:border-b hover:border-black transition-none">
            pricing
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="https://instagram.com" className="text-black" aria-label="Instagram">
            <Instagram size={20} />
          </Link>
          <MobileMenu
            links={[
              { href: "/", label: "home", active: true },
              { href: "/portfolio", label: "portfolio" },
              { href: "/pricing", label: "pricing" },
            ]}
          />
        </div>
      </header>

      <AnimatedSection animation="fade" className="mt-8 mb-16">
        <PhotoGallery />
      </AnimatedSection>

      <ParallaxSection className="mb-16">
        <div className="w-full h-[1px] bg-gray-200"></div>
      </ParallaxSection>

      <section className="container mx-auto px-4 py-8 mb-16">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <AnimatedSection animation="slide-right" className="md:col-span-2">
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
              <Image
                src="/photographer.png"
                alt="Nicolas Klein - Photographer"
                fill
                className="object-cover grayscale"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </AnimatedSection>

          <div className="md:col-span-3">
            <AnimatedSection animation="slide-up">
              <h2 className="text-2xl font-bold uppercase mb-4">FREELANCE PHOTOGRAPHER</h2>
            </AnimatedSection>

            <div className="text-sm space-y-4">
              <AnimatedSection animation="slide-up" delay={0.1}>
                <p className="leading-relaxed">
                  Capturing moments that tell stories through a minimalist black and white lens. Specializing in
                  portraits, events, and commercial photography with an artistic approach that emphasizes composition
                  and emotion.
                </p>
              </AnimatedSection>

              <AnimatedSection animation="slide-up" delay={0.2}>
                <p className="text-sm text-gray-700">
                  portraits / events / weddings / commercial / editorial / travel / architecture
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="container mx-auto px-4 py-16 mb-16 bg-gray-50">
        <AnimatedSection animation="fade">
          <h2 className="text-2xl font-bold uppercase mb-8 text-center">GET IN TOUCH</h2>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={0.1}>
          <ContactForm />
        </AnimatedSection>
      </section>

      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200">
        <AnimatedSection animation="fade">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Nicolas Klein Photography</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-gray-500 hover:text-black">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-black">
                Terms
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-black">
                Instagram
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </footer>
    </main>
  )
}
