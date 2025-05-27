import Link from "next/link";
import { Instagram } from "lucide-react";
import MobileMenu from "@/components/mobile-menu";
import AnimatedSection from "@/components/animated-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Impressum",
    description:
        "Impressum und rechtliche Angaben von Nicolas Klein Photography, Saarbrücken.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function Impressum() {
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
                            { href: "/", label: "startseite" },
                            { href: "/portfolio", label: "portfolio" },
                            { href: "/pricing", label: "preise" },
                            {
                                href: "/impressum",
                                label: "impressum",
                                active: true,
                            },
                        ]}
                    />
                </div>
            </header>

            <section className="container mx-auto px-4 py-16">
                <AnimatedSection animation="fade">
                    <h1 className="text-3xl font-bold uppercase mb-8">
                        IMPRESSUM
                    </h1>
                </AnimatedSection>

                <AnimatedSection animation="slide-up" delay={0.1}>
                    <div className="max-w-2xl space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Angaben gemäß § 5 TMG
                            </h2>
                            <div className="space-y-2 text-sm">
                                <p>
                                    <strong>Nicolas Klein Photography</strong>
                                </p>
                                <p>Nicolas Klein</p>
                                <p>Heinrich-Köhl-Str. 41</p>
                                <p>66113 Saarbrücken</p>
                                <p>Deutschland</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Kontakt
                            </h2>
                            <div className="space-y-2 text-sm">
                                <p>
                                    <strong>E-Mail:</strong>{" "}
                                    <a
                                        href="mailto:hello@nicolasklein.photography?subject=Fotografie%20Anfrage&body=Hallo%20Nicolas,%0A%0Aich%20würde%20gerne%20über%20deine%20Fotografie-Services%20sprechen.%0A%0AViele%20Grüße"
                                        className="underline hover:no-underline"
                                    >
                                        hello@nicolasklein.photography
                                    </a>
                                </p>
                                <p>
                                    <strong>Telefon:</strong> +49 176 47694426
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Berufsbezeichnung und berufsrechtliche
                                Regelungen
                            </h2>
                            <div className="space-y-2 text-sm">
                                <p>
                                    <strong>Berufsbezeichnung:</strong> Fotograf
                                </p>
                                <p>
                                    <strong>Zuständige Kammer:</strong>{" "}
                                    Handwerkskammer des Saarlandes
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Kleinunternehmerregelung
                            </h2>
                            <p className="text-sm">
                                Gemäß § 19 UStG wird keine Umsatzsteuer
                                berechnet.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Redaktionell verantwortlich
                            </h2>
                            <p className="text-sm">
                                Nicolas Klein (Anschrift wie oben)
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                EU-Streitschlichtung
                            </h2>
                            <p className="text-sm">
                                Die Europäische Kommission stellt eine Plattform
                                zur Online-Streitbeilegung (OS) bereit:{" "}
                                <a
                                    href="https://ec.europa.eu/consumers/odr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:no-underline"
                                >
                                    https://ec.europa.eu/consumers/odr/
                                </a>
                                <br />
                                Unsere E-Mail-Adresse finden Sie oben im
                                Impressum.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Verbraucherstreitbeilegung/Universalschlichtungsstelle
                            </h2>
                            <p className="text-sm">
                                Wir sind nicht bereit oder verpflichtet, an
                                Streitbeilegungsverfahren vor einer
                                Verbraucherschlichtungsstelle teilzunehmen.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Haftung für Inhalte
                            </h2>
                            <p className="text-sm">
                                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG
                                für eigene Inhalte auf diesen Seiten nach den
                                allgemeinen Gesetzen verantwortlich. Nach §§ 8
                                bis 10 TMG sind wir als Diensteanbieter jedoch
                                nicht unter der Verpflichtung, übermittelte oder
                                gespeicherte fremde Informationen zu überwachen
                                oder nach Umständen zu forschen, die auf eine
                                rechtswidrige Tätigkeit hinweisen.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Urheberrecht
                            </h2>
                            <p className="text-sm">
                                Die durch die Seitenbetreiber erstellten Inhalte
                                und Werke auf diesen Seiten unterliegen dem
                                deutschen Urheberrecht. Die Vervielfältigung,
                                Bearbeitung, Verbreitung und jede Art der
                                Verwertung außerhalb der Grenzen des
                                Urheberrechtes bedürfen der schriftlichen
                                Zustimmung des jeweiligen Autors bzw.
                                Erstellers. Downloads und Kopien dieser Seite
                                sind nur für den privaten, nicht kommerziellen
                                Gebrauch gestattet.
                            </p>
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
    );
}
