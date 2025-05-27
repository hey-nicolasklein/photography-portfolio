import Link from "next/link";
import { Instagram } from "lucide-react";
import Image from "next/image";
import PhotoGallery from "@/components/photo-gallery";
import MobileMenu from "@/components/mobile-menu";
import AnimatedSection from "@/components/animated-section";
import ParallaxSection from "@/components/parallax-section";
import { getGalleryItems, getBio } from "@/lib/strapi";

const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://nicolasklein.photography",
    name: "Nicolas Klein Photography",
    alternateName: "Nicolas Klein Fotografie",
    description:
        "Professioneller Fotograf in Saarbrücken. Spezialisiert auf Porträts, Events und Follow-Around Fotografie.",
    url: "https://nicolasklein.photography",
    telephone: "+49-176-47694426",
    email: "hello@nicolasklein.photography",
    address: {
        "@type": "PostalAddress",
        streetAddress: "Heinrich-Köhl-Str. 41",
        addressLocality: "Saarbrücken",
        postalCode: "66113",
        addressCountry: "DE",
    },
    geo: {
        "@type": "GeoCoordinates",
        latitude: "49.2401",
        longitude: "6.9969",
    },
    areaServed: {
        "@type": "State",
        name: "Saarland",
    },
    serviceType: [
        "Portrait Fotografie",
        "Event Fotografie",
        "Hochzeitsfotografie",
        "Follow Around Fotografie",
    ],
    priceRange: "€100-€300",
    sameAs: ["https://www.instagram.com/hey.nicolasklein/"],
    founder: {
        "@type": "Person",
        name: "Nicolas Klein",
    },
};

export default async function Home() {
    const galleryItems = await getGalleryItems();
    const bio = await getBio();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            <main className="min-h-screen bg-white text-black">
                <header className="bg-white z-50 container mx-auto px-4 py-8 flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-xl font-light tracking-wider hover:opacity-80 transition-opacity"
                    >
                        NICOLAS KLEIN
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            href="/"
                            className="text-sm border-b border-black transition-none"
                        >
                            startseite
                        </Link>
                        <Link
                            href="/portfolio"
                            className="text-sm hover:border-b hover:border-black transition-none"
                        >
                            portfolio
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-sm hover:border-b hover:border-black transition-none"
                        >
                            preise
                        </Link>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="https://www.instagram.com/hey.nicolasklein/"
                            className="text-black hover:scale-110 transition-transform duration-300"
                            aria-label="Instagram"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Instagram size={20} />
                        </Link>
                        <MobileMenu
                            links={[
                                {
                                    href: "/",
                                    label: "startseite",
                                    active: true,
                                },
                                { href: "/portfolio", label: "portfolio" },
                                { href: "/pricing", label: "preise" },
                            ]}
                        />
                    </div>
                </header>

                <AnimatedSection animation="fade" className="mt-8 mb-16">
                    <PhotoGallery galleryItems={galleryItems} />
                </AnimatedSection>

                <ParallaxSection className="mb-16">
                    <div className="w-full h-[1px] bg-gray-200"></div>
                </ParallaxSection>

                <section className="container mx-auto px-4 py-8 mb-16">
                    <div className="grid md:grid-cols-5 gap-8 items-center">
                        <AnimatedSection
                            animation="slide-right"
                            className="md:col-span-2"
                        >
                            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                                <Image
                                    src={
                                        bio?.profileImage || "/photographer.png"
                                    }
                                    alt={
                                        bio?.profileImageAlt ||
                                        "Nicolas Klein - Photographer"
                                    }
                                    fill
                                    className="object-cover grayscale"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                />
                            </div>
                        </AnimatedSection>

                        <div className="md:col-span-3">
                            <AnimatedSection animation="slide-up">
                                <h2 className="text-2xl font-bold uppercase mb-4">
                                    {bio?.title || "FREIBERUFLICHER FOTOGRAF"}
                                </h2>
                            </AnimatedSection>

                            <div className="text-sm space-y-4">
                                <AnimatedSection
                                    animation="slide-up"
                                    delay={0.1}
                                >
                                    <p className="leading-relaxed">
                                        {bio?.description ||
                                            "Ich halte Momente fest, die Geschichten erzählen – mit einem minimalistischen Blick in Schwarzweiß. Spezialisiert auf Porträts, Events und kommerzielle Fotografie mit einem künstlerischen Ansatz, der Komposition und Emotion in den Vordergrund stellt."}
                                    </p>
                                </AnimatedSection>

                                <AnimatedSection
                                    animation="slide-up"
                                    delay={0.2}
                                >
                                    <p className="text-sm text-gray-700">
                                        {bio?.tags ||
                                            "porträts / events / hochzeiten / commercial / editorial / travel / architektur"}
                                    </p>
                                </AnimatedSection>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="contact"
                    className="container mx-auto px-4 py-16 mb-16 bg-gray-50"
                >
                    <AnimatedSection animation="fade">
                        <h2 className="text-2xl font-bold uppercase mb-8 text-center">
                            KONTAKT
                        </h2>
                    </AnimatedSection>

                    <AnimatedSection animation="slide-up" delay={0.1}>
                        <div className="max-w-md mx-auto text-center space-y-6">
                            <p className="text-gray-600">
                                Bereit, deine besonderen Momente festzuhalten?
                                Lass uns über deine Fotografie-Wünsche sprechen.
                            </p>
                            <a
                                href="mailto:hello@nicolasklein.photography?subject=Fotografie%20Anfrage&body=Hallo%20Nicolas,%0A%0Aich%20würde%20gerne%20über%20deine%20Fotografie-Services%20sprechen.%0A%0AProjekt-Art:%20%0AEvent-Datum:%20%0ABudget-Bereich:%20%0A%0ABitte%20lass%20mich%20wissen,%20wann%20du%20verfügbar%20bist.%0A%0AViele%20Grüße"
                                className="inline-block bg-black text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors duration-300 hover:scale-105 transform"
                            >
                                E-Mail senden
                            </a>
                            <div className="text-sm text-gray-500">
                                <p>hello@nicolasklein.photography</p>
                            </div>
                        </div>
                    </AnimatedSection>
                </section>

                <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200">
                    <AnimatedSection animation="fade">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-sm text-gray-500">
                                © {new Date().getFullYear()} Nicolas Klein
                                Photography
                            </p>
                            <div className="flex space-x-4 mt-4 md:mt-0">
                                <Link
                                    href="/impressum"
                                    className="text-sm text-gray-500 hover:text-black transition-colors"
                                >
                                    Impressum
                                </Link>
                                <Link
                                    href="https://www.instagram.com/hey.nicolasklein/"
                                    className="text-sm text-gray-500 hover:text-black transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Instagram
                                </Link>
                            </div>
                        </div>
                    </AnimatedSection>
                </footer>
            </main>
        </>
    );
}
