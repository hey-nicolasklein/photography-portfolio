import { Camera, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";
import Header from "@/components/header";
import AnimatedSection from "@/components/animated-section";
import ContactActionButton from "@/components/contact-action-button";
import { generateMetadata } from "@/lib/og";

export const metadata = generateMetadata({
    title: "Preise",
    description: "Transparente Preise für professionelle Fotografie in Saarbrücken. Portrait- und Event-Fotografie zu fairen Konditionen.",
    path: "/pricing",
});

export default function Pricing() {
    return (
        <main className="min-h-screen bg-white text-black">
            <Header currentPage="pricing" />

            <section className="container mx-auto px-4 py-16">
                <AnimatedSection animation="fade">
                    <div className="max-w-6xl mx-auto">
                        {/* Hero Section */}
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tighter">
                                Preise
                            </h1>
                            <p className="text-lg font-light tracking-wider uppercase text-gray-600 mb-8">
                                Transparente Konditionen für deine Fotografie
                            </p>
                            <p className="text-base font-light max-w-2xl mx-auto leading-relaxed text-gray-700">
                                Qualität hat ihren Preis – aber sie sollte fair und transparent sein. 
                                Hier findest du meine Standardpreise für die beliebtesten Fotografie-Services.
                            </p>
                        </div>

                        {/* Pricing Cards */}
                        <AnimatedSection animation="slide-up" delay={0.2}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                                {/* Portrait Photography */}
                                <div className="bg-gray-50 p-8 lg:p-10 border border-gray-200 hover:border-gray-300 transition-colors duration-300">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white mb-6">
                                            <Camera size={28} />
                                        </div>
                                        <h2 className="text-2xl font-bold uppercase tracking-wider mb-3">
                                            Portrait
                                        </h2>
                                        <p className="text-gray-600 font-light leading-relaxed">
                                            Authentische Porträtfotografie für Einzelpersonen, Paare oder kleine Gruppen
                                        </p>
                                    </div>

                                    <div className="text-center mb-8">
                                        <div className="text-4xl lg:text-5xl font-black mb-2">
                                            $200
                                        </div>
                                        <div className="text-gray-600 font-light uppercase tracking-wide text-sm">
                                            pro Tag
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start">
                                            <CheckCircle size={16} className="mr-3 mt-1 text-gray-600 flex-shrink-0" />
                                            <span className="text-sm font-light">Bis zu 4 Stunden Shooting</span>
                                        </div>
                                        <div className="flex items-start">
                                            <CheckCircle size={16} className="mr-3 mt-1 text-gray-600 flex-shrink-0" />
                                            <span className="text-sm font-light">Alle bearbeiteten Bilder in hoher Auflösung</span>
                                        </div>
                                        <div className="flex items-start">
                                            <CheckCircle size={16} className="mr-3 mt-1 text-gray-600 flex-shrink-0" />
                                            <span className="text-sm font-light">Online-Galerie für 30 Tage</span>
                                        </div>
                                        <div className="flex items-start">
                                            <CheckCircle size={16} className="mr-3 mt-1 text-gray-600 flex-shrink-0" />
                                            <span className="text-sm font-light">Nutzungsrechte für persönliche Zwecke</span>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <ContactActionButton 
                                            text="Portrait buchen"
                                            variant="dark"
                                        />
                                    </div>
                                </div>

                                {/* Event Photography */}
                                <div className="bg-black text-white p-8 lg:p-10 border border-black relative overflow-hidden">
                                    {/* Popular badge */}
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-white text-black px-3 py-1 text-xs font-medium uppercase tracking-wider">
                                            Beliebt
                                        </div>
                                    </div>

                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-black mb-6">
                                            <Users size={28} />
                                        </div>
                                        <h2 className="text-2xl font-bold uppercase tracking-wider mb-3">
                                            Events
                                        </h2>
                                        <p className="text-gray-300 font-light leading-relaxed">
                                            Hochzeiten, Partys, Firmenfeiern und besondere Anlässe
                                        </p>
                                    </div>

                                    <div className="text-center mb-8">
                                        <div className="text-4xl lg:text-5xl font-black mb-2">
                                            $400
                                        </div>
                                        <div className="text-gray-300 font-light uppercase tracking-wide text-sm">
                                            pro Tag
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start">
                                            <CheckCircle size={16} className="mr-3 mt-1 text-gray-300 flex-shrink-0" />
                                            <span className="text-sm font-light">Bis zu 8 Stunden Begleitung</span>
                                        </div>
                                        <div className="flex items-start">
                                            <CheckCircle size={16} className="mr-3 mt-1 text-gray-300 flex-shrink-0" />
                                            <span className="text-sm font-light">Alle bearbeiteten Bilder in hoher Auflösung</span>
                                        </div>
                                        <div className="flex items-start">
                                            <CheckCircle size={16} className="mr-3 mt-1 text-gray-300 flex-shrink-0" />
                                            <span className="text-sm font-light">Online-Galerie für 90 Tage</span>
                                        </div>
                                        <div className="flex items-start">
                                            <CheckCircle size={16} className="mr-3 mt-1 text-gray-300 flex-shrink-0" />
                                            <span className="text-sm font-light">Erweiterte Nutzungsrechte</span>
                                        </div>
                                        <div className="flex items-start">
                                            <CheckCircle size={16} className="mr-3 mt-1 text-gray-300 flex-shrink-0" />
                                            <span className="text-sm font-light">Vorbesprechung und Locationbesichtigung</span>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <ContactActionButton 
                                            text="Event buchen"
                                            variant="light"
                                        />
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Individual Pricing Section */}
                        <AnimatedSection animation="slide-up" delay={0.4}>
                            <div className="text-center mb-16 max-w-3xl mx-auto">
                                <h3 className="text-2xl font-bold uppercase tracking-wider mb-6">
                                    Individuelle Projekte
                                </h3>
                                <p className="text-lg font-light leading-relaxed text-gray-700 mb-8">
                                    Jedes Projekt ist einzigartig. Ob kommerzielle Fotografie, mehrere Tage oder 
                                    spezielle Anforderungen – lass uns über deine Vorstellungen sprechen und 
                                    gemeinsam ein maßgeschneidertes Angebot erstellen.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                    <div className="text-center p-6">
                                        <Clock size={32} className="mx-auto mb-4 text-gray-600" />
                                        <h4 className="font-medium uppercase tracking-wider mb-2 text-sm">
                                            Flexible Dauer
                                        </h4>
                                        <p className="text-sm font-light text-gray-600">
                                            Von einzelnen Stunden bis zu mehrtägigen Projekten
                                        </p>
                                    </div>
                                    
                                    <div className="text-center p-6">
                                        <Camera size={32} className="mx-auto mb-4 text-gray-600" />
                                        <h4 className="font-medium uppercase tracking-wider mb-2 text-sm">
                                            Alle Bereiche
                                        </h4>
                                        <p className="text-sm font-light text-gray-600">
                                            Business, Fashion, Lifestyle oder Architektur
                                        </p>
                                    </div>
                                    
                                    <div className="text-center p-6">
                                        <ArrowRight size={32} className="mx-auto mb-4 text-gray-600" />
                                        <h4 className="font-medium uppercase tracking-wider mb-2 text-sm">
                                            Faire Preise
                                        </h4>
                                        <p className="text-sm font-light text-gray-600">
                                            Transparente Kalkulation basierend auf deinen Bedürfnissen
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Call to Action */}
                        <AnimatedSection animation="fade" delay={0.5}>
                            <div className="text-center bg-gray-50 p-8 lg:p-12 border border-gray-200">
                                <h3 className="text-2xl font-bold uppercase tracking-wider mb-4">
                                    Bereit für dein Projekt?
                                </h3>
                                <p className="text-lg font-light mb-8 text-gray-600 max-w-2xl mx-auto">
                                    Lass uns über deine Vorstellungen sprechen. Ich erstelle dir gerne ein 
                                    individuelles Angebot, das perfekt zu deinem Projekt und Budget passt.
                                </p>
                                
                                <ContactActionButton 
                                    text="Individuelles Angebot anfragen"
                                    variant="dark"
                                    className="px-8 py-4 text-base"
                                />
                                
                                <div className="mt-6 text-sm text-gray-500 font-light">
                                    Kostenlose Beratung • Schnelle Antwort • Faire Preise
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </AnimatedSection>
            </section>
        </main>
    );
} 