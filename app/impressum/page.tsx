import Link from "next/link";
import Header from "@/components/header";
import AnimatedSection from "@/components/animated-section";
import { generateMetadata } from "@/lib/og";
import { getNicolasAge } from "@/lib/age";

export const metadata = generateMetadata({
    title: "Impressum",
    description: "Impressum und rechtliche Angaben von Nicolas Klein Photography, Saarbrücken.",
    path: "/impressum",
    noIndex: true,
});

export default function Impressum() {
    const age = getNicolasAge();
    
    return (
        <main className="min-h-screen bg-white text-black">
            <Header />

            <section className="container mx-auto px-4 py-16">
                <AnimatedSection animation="fade">
                    <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tighter">
                        IMPRESSUM
                    </h1>
                </AnimatedSection>

                <AnimatedSection animation="slide-up" delay={0.1}>
                    <div className="max-w-2xl space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 tracking-wide uppercase">
                                Angaben gemäß § 5 TMG
                            </h2>
                            <div className="space-y-2 text-sm font-light">
                                <p>
                                    <strong className="font-medium">
                                        Nicolas Klein Photography
                                    </strong>
                                </p>
                                <p>Nicolas Klein</p>
                                <p>Heinrich-Köhl-Str. 41</p>
                                <p>66113 Saarbrücken</p>
                                <p>Deutschland</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 tracking-wide uppercase">
                                Kontakt
                            </h2>
                            <div className="space-y-2 text-sm font-light">
                                <p>
                                    <strong className="font-medium">
                                        E-Mail:
                                    </strong>{" "}
                                    <a
                                        href="mailto:hello@nicolasklein.photography?subject=Fotografie%20Anfrage&body=Hallo%20Nicolas,%0A%0Aich%20würde%20gerne%20über%20deine%20Fotografie-Services%20sprechen.%0A%0AViele%20Grüße"
                                        className="underline hover:no-underline"
                                    >
                                        hello@nicolasklein.photography
                                    </a>
                                </p>
                                <p>
                                    <strong className="font-medium">
                                        Telefon:
                                    </strong>{" "}
                                    +49 176 47694426
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 tracking-wide uppercase">
                                Berufsbezeichnung und berufsrechtliche
                                Regelungen
                            </h2>
                            <div className="space-y-2 text-sm font-light">
                                <p>
                                    <strong className="font-medium">
                                        Berufsbezeichnung:
                                    </strong>{" "}
                                    Fotograf
                                </p>
                                <p>
                                    <strong className="font-medium">
                                        Zuständige Kammer:
                                    </strong>{" "}
                                    Handwerkskammer des Saarlandes
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 tracking-wide uppercase">
                                Kleinunternehmerregelung
                            </h2>
                            <p className="text-sm font-light">
                                Gemäß § 19 UStG wird keine Umsatzsteuer
                                berechnet.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 tracking-wide uppercase">
                                Redaktionell verantwortlich
                            </h2>
                            <p className="text-sm font-light">
                                Nicolas Klein, {age} Jahre (Anschrift wie oben)
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 tracking-wide uppercase">
                                EU-Streitschlichtung
                            </h2>
                            <p className="text-sm font-light">
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
                            <h2 className="text-xl font-semibold mb-4 tracking-wide uppercase">
                                Verbraucherstreitbeilegung/Universalschlichtungsstelle
                            </h2>
                            <p className="text-sm font-light">
                                Wir sind nicht bereit oder verpflichtet, an
                                Streitbeilegungsverfahren vor einer
                                Verbraucherschlichtungsstelle teilzunehmen.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 tracking-wide uppercase">
                                Haftung für Inhalte
                            </h2>
                            <p className="text-sm font-light">
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
                            <h2 className="text-xl font-semibold mb-4 tracking-wide uppercase">
                                Urheberrecht
                            </h2>
                            <p className="text-sm font-light">
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
                        <p className="text-sm text-gray-500 font-light tracking-wider uppercase">
                            © {new Date().getFullYear()} Nicolas Klein
                            Photography
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link
                                href="/impressum"
                                className="text-sm text-gray-500 hover:text-black transition-colors font-light tracking-wider uppercase"
                            >
                                Impressum
                            </Link>
                            <Link
                                href="https://www.instagram.com/hey.nicolasklein/"
                                className="text-sm text-gray-500 hover:text-black transition-colors font-light tracking-wider uppercase"
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
