import Link from "next/link"
import { Instagram, Check } from "lucide-react"
import MobileMenu from "@/components/mobile-menu"
import AnimatedSection from "@/components/animated-section"

export default function Pricing() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="bg-white z-50 container mx-auto px-4 py-8 flex justify-between items-center">
        <h1 className="text-xl font-light tracking-wider">NICOLAS KLEIN</h1>
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-sm hover:border-b hover:border-black transition-none">
            home
          </Link>
          <Link href="/portfolio" className="text-sm hover:border-b hover:border-black transition-none">
            portfolio
          </Link>
          <Link href="/pricing" className="text-sm border-b border-black transition-none">
            pricing
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="https://instagram.com" className="text-black" aria-label="Instagram">
            <Instagram size={20} />
          </Link>
          <MobileMenu
            links={[
              { href: "/", label: "home" },
              { href: "/portfolio", label: "portfolio" },
              { href: "/pricing", label: "pricing", active: true },
            ]}
          />
        </div>
      </header>

      <section className="container mx-auto px-4 py-16">
        <AnimatedSection animation="fade">
          <h2 className="text-3xl font-bold uppercase mb-8 text-center">PRICING</h2>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Package */}
            <div className="border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-4">Basic</h3>
              <p className="text-3xl font-light mb-6">$299</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>1 hour session</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>10 edited digital photos</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>Online gallery</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>Personal use license</span>
                </li>
              </ul>
              <button className="w-full py-2 border border-black hover:bg-black hover:text-white transition-colors">
                Book Now
              </button>
            </div>

            {/* Standard Package */}
            <div className="border border-black p-8 bg-gray-50">
              <h3 className="text-xl font-bold mb-4">Standard</h3>
              <p className="text-3xl font-light mb-6">$499</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>2 hour session</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>20 edited digital photos</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>Online gallery</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>Personal use license</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>2 outfit changes</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>5 physical prints (8×10)</span>
                </li>
              </ul>
              <button className="w-full py-2 bg-black text-white hover:bg-gray-800 transition-colors">Book Now</button>
            </div>

            {/* Premium Package */}
            <div className="border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-4">Premium</h3>
              <p className="text-3xl font-light mb-6">$899</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>4 hour session</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>40 edited digital photos</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>Online gallery</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>Commercial use license</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>Multiple locations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>10 physical prints (8×10)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-black mr-2 mt-0.5" />
                  <span>Photo album</span>
                </li>
              </ul>
              <button className="w-full py-2 border border-black hover:bg-black hover:text-white transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade" delay={0.3} className="mt-16 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-medium mb-4">Custom Packages</h3>
          <p className="text-gray-700 mb-6">
            Need something specific? I offer custom packages tailored to your unique requirements. Contact me to discuss
            your project and get a personalized quote.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Get in Touch
          </Link>
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
