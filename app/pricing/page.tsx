import Link from "next/link";
import { Instagram, Check, Camera, Users, Clock } from "lucide-react";
import MobileMenu from "@/components/mobile-menu";
import AnimatedSection from "@/components/animated-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preise",
    description:
        "Transparente Preise für professionelle Fotografie. Portrait (€100), Event (€200), Follow Around (€300). Maßgeschneiderte Pakete verfügbar.",
    openGraph: {
        title: "Preise | Nicolas Klein Photography",
        description:
            "Transparente Preise für professionelle Fotografie. Portrait, Event und Follow Around Pakete.",
    },
};

export default function Pricing() {
    return (
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
                        className="text-sm hover:border-b hover:border-black transition-none"
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
                        className="text-sm border-b border-black transition-none"
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
                            { href: "/", label: "startseite" },
                            { href: "/portfolio", label: "portfolio" },
                            {
                                href: "/pricing",
                                label: "preise",
                                active: true,
                            },
                        ]}
                    />
                </div>
            </header>

            <section className="container mx-auto px-4 py-16">
                <AnimatedSection animation="fade">
                    <h2 className="text-3xl font-bold uppercase mb-8 text-center">
                        PREISE
                    </h2>
                </AnimatedSection>

                <AnimatedSection animation="slide-up" delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Portrait Package */}
                        <div className="group border border-gray-200 p-8 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:border-black relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="flex items-center mb-4">
                                    <Camera className="h-6 w-6 text-black mr-3 group-hover:rotate-12 transition-transform duration-300" />
                                    <h3 className="text-xl font-bold">
                                        Portrait
                                    </h3>
                                </div>
                                <p className="text-3xl font-light mb-4 group-hover:text-gray-800 transition-colors">
                                    €100
                                </p>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    Perfekt für persönliche Porträts. Wir
                                    schaffen gemeinsam authentische Bilder, die
                                    deine Persönlichkeit zum Strahlen bringen.
                                    In entspannter Atmosphäre entstehen zeitlose
                                    Aufnahmen, die du für immer schätzen wirst.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>3 Stunden Shooting</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>30 bearbeitete Fotos</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Eine Person</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Ein Location</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Online Galerie</span>
                                    </li>
                                </ul>
                                <a
                                    href="mailto:hello@nicolasklein.photography?subject=Portrait%20Fotoshooting%20Anfrage&body=Hallo%20Nicolas,%0A%0Aich%20möchte%20gerne%20ein%20Portrait-Fotoshooting%20buchen%20(€100).%0A%0AGewünschter%20Termin:%20%0AGewünschte%20Uhrzeit:%20%0ALocation-Wünsche:%20%0ABesondere%20Wünsche:%20%0A%0ABitte%20bestätige%20deine%20Verfügbarkeit.%0A%0AViele%20Grüße"
                                    className="w-full py-3 border border-black hover:bg-black hover:text-white transition-all duration-300 inline-block text-center group-hover:shadow-lg transform hover:translate-y-1"
                                >
                                    Jetzt buchen
                                </a>
                            </div>
                        </div>

                        {/* Event Package */}
                        <div className="group border border-black p-8 bg-gray-50 transition-all duration-500 hover:shadow-2xl hover:scale-105 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-800 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="flex items-center mb-4">
                                    <Users className="h-6 w-6 text-black mr-3 group-hover:rotate-12 transition-transform duration-300" />
                                    <h3 className="text-xl font-bold">Event</h3>
                                </div>
                                <p className="text-3xl font-light mb-4 group-hover:text-gray-800 transition-colors">
                                    €200
                                </p>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    Halte unvergessliche Momente fest. Ob
                                    Hochzeit, Geburtstag oder Firmenfeier – ich
                                    dokumentiere die Emotionen und besonderen
                                    Augenblicke deines Events mit einem Auge für
                                    Details und natürliche Schönheit.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>6 Stunden Event-Coverage</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>200 bearbeitete Fotos</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Eine Location</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Mehrere Personen</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Online Galerie</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Schnelle Bearbeitung</span>
                                    </li>
                                </ul>
                                <a
                                    href="mailto:hello@nicolasklein.photography?subject=Event%20Fotografie%20Anfrage&body=Hallo%20Nicolas,%0A%0Aich%20möchte%20gerne%20Event-Fotografie%20buchen%20(€200).%0A%0AEvent-Datum:%20%0AEvent-Zeit:%20%0ALocation:%20%0AArt%20des%20Events:%20%0AAnzahl%20Gäste:%20%0ABesondere%20Wünsche:%20%0A%0ABitte%20bestätige%20deine%20Verfügbarkeit.%0A%0AViele%20Grüße"
                                    className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 inline-block text-center group-hover:shadow-lg transform hover:translate-y-1"
                                >
                                    Jetzt buchen
                                </a>
                            </div>
                        </div>

                        {/* Follow Around Package */}
                        <div className="group border border-gray-200 p-8 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:border-black relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="flex items-center mb-4">
                                    <Clock className="h-6 w-6 text-black mr-3 group-hover:rotate-12 transition-transform duration-300" />
                                    <h3 className="text-xl font-bold">
                                        Follow Around
                                    </h3>
                                </div>
                                <p className="text-3xl font-light mb-4 group-hover:text-gray-800 transition-colors">
                                    €300
                                </p>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    Ein ganzer Tag voller Erinnerungen. Ich
                                    begleite dich durch deinen besonderen Tag
                                    und halte alle spontanen, authentischen
                                    Momente fest. Perfekt für Hochzeitstage,
                                    Geburtstage oder einmalige Erlebnisse.
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>12 Stunden Begleitung</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Mind. 300 bearbeitete Fotos</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Mehrere Locations</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Spontane Aufnahmen</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Online Galerie</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Vollständige Dokumentation</span>
                                    </li>
                                    <li className="flex items-start">
                                        <Check className="h-5 w-5 text-black mr-2 mt-0.5 group-hover:scale-110 transition-transform" />
                                        <span>Digitales Fotoalbum</span>
                                    </li>
                                </ul>
                                <a
                                    href="mailto:hello@nicolasklein.photography?subject=Follow%20Around%20Fotografie%20Anfrage&body=Hallo%20Nicolas,%0A%0Aich%20möchte%20gerne%20Follow%20Around%20Fotografie%20buchen%20(€300).%0A%0AGewünschter%20Tag:%20%0AAnlass:%20%0AGeplante%20Locations:%20%0ABesondere%20Momente:%20%0ABesondere%20Wünsche:%20%0A%0ABitte%20bestätige%20deine%20Verfügbarkeit.%0A%0AViele%20Grüße"
                                    className="w-full py-3 border border-black hover:bg-black hover:text-white transition-all duration-300 inline-block text-center group-hover:shadow-lg transform hover:translate-y-1"
                                >
                                    Jetzt buchen
                                </a>
                            </div>
                        </div>
                    </div>
                </AnimatedSection>

                <AnimatedSection
                    animation="fade"
                    delay={0.3}
                    className="mt-20 text-center max-w-3xl mx-auto"
                >
                    <div className="group p-8 border border-gray-200 hover:border-black transition-all duration-500 hover:shadow-xl">
                        <h3 className="text-2xl font-medium mb-6 group-hover:text-gray-800 transition-colors">
                            Maßgeschneiderte Fotografie
                        </h3>
                        <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                            Deine Vision ist einzigartig, und deine Fotografie
                            sollte es auch sein. Ob außergewöhnliche Locations,
                            spezielle Wünsche oder kreative Konzepte – gemeinsam
                            entwickeln wir das perfekte Paket für dein Projekt.
                            Lass uns über deine Ideen sprechen und etwas
                            Besonderes schaffen, das genau zu dir passt.
                        </p>
                        <a
                            href="mailto:hello@nicolasklein.photography?subject=Individuelle%20Fotografie%20Anfrage&body=Hallo%20Nicolas,%0A%0Aich%20habe%20eine%20individuelle%20Fotografie-Idee%20und%20würde%20gerne%20ein%20maßgeschneidertes%20Angebot%20besprechen.%0A%0AMein%20Projekt:%20%0AGewünschter%20Zeitraum:%20%0ABudget-Vorstellung:%20%0ABesondere%20Anforderungen:%20%0AKreative%20Wünsche:%20%0A%0AIch%20freue%20mich%20auf%20unser%20Gespräch!%0A%0AViele%20Grüße"
                            className="inline-block px-8 py-4 bg-black text-white hover:bg-gray-800 transition-all duration-300 group-hover:shadow-lg transform hover:translate-y-1 text-lg"
                        >
                            Lass uns sprechen
                        </a>
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
    );
}
