import Link from "next/link";
import { Instagram, Camera, MapPin, Mail, Aperture, PartyPopper, Trophy } from "lucide-react";
import Header from "@/components/header";
import AnimatedSection from "@/components/animated-section";
import ContactActionButton from "@/components/contact-action-button";
import { generateMetadata } from "@/lib/og";
import { getBio } from "@/lib/strapi";
import ProfileBubble from "@/components/profile-bubble";
import { getNicolasAge } from "@/lib/age";

export const metadata = generateMetadata({
    title: "Kontakt",
    description: "Erfahre mehr über Nicolas Klein - Freiberuflicher Fotograf aus Saarbrücken. Spezialisiert auf Porträts, Events und kommerzielle Fotografie.",
    path: "/kontakt",
});

export default async function Kontakt() {
    const bio = await getBio();
    const age = getNicolasAge();

    console.log(age);
    
    return (
        <main className="min-h-screen bg-white text-black">
            <Header currentPage="kontakt" />

            <section className="container mx-auto px-4 py-16">
                <AnimatedSection animation="fade">
                    <div className="max-w-4xl mx-auto">
                        {/* Hero Section */}
                        <div className="text-center mb-16">
                            <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tighter">
                                Nicolas Klein
                            </h1>
                            <div className="flex items-center justify-center mb-8">
                                <Camera size={24} className="mr-3" />
                                <p className="text-lg font-light tracking-wider uppercase">
                                    Freiberuflicher Fotograf
                                </p>
                            </div>

                            {bio?.profileImage && (
                                <div className="flex justify-center">
                                    <ProfileBubble
                                        imageUrl={bio.profileImage}
                                        alt={bio.profileImageAlt || "Profilbild"}
                                        message="Lust zu quatschen? Schreib mir einfach eine Nachricht – ich freu mich!"
                                        size="xl"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Bio Section */}
                        <AnimatedSection animation="slide-up" delay={0.2}>
                            <div className="max-w-3xl mx-auto mb-16">
                                {bio?.description ? (
                                    <div className="text-lg leading-relaxed font-light text-center">
                                        {bio.description.split('\n').map((paragraph, index) => (
                                            <p key={index} className="mb-6">
                                                <em>{paragraph}</em>
                                            </p>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-lg leading-relaxed font-light text-center">
                                        <p className="mb-6">
                                            <em>
                                                Hey! Ich bin Nico, {age} Jahre alt und arbeite seit einigen Jahren als freiberuflicher Fotograf in Saarbrücken. 
                                                Mit meiner Kamera fange ich authentische Momente ein, die im Alltag oft verloren gehen – Geschichten, die erzählt werden wollen.
                                            </em>
                                        </p>
                                        
                                        <p className="mb-6">
                                            <em>
                                                Ob Porträts, Fußball, Partys oder Events – ich begleite dich und halte den Zauber des Moments fest. 
                                                Ich verschwinde im Geschehen, um die echte, ungefilterte Seite der Menschen einzufangen – ehrlich, kreativ und emotional. 
                                                Durch meine ruhige Art schaffe ich eine entspannte Atmosphäre, in der sich meine Kunden wohlfühlen und natürlich vor der Kamera agieren können.
                                            </em>
                                        </p>
                                        
                                        <p className="mb-6">
                                            <em>
                                                Für mich ist Fotografie nicht nur Handwerk, sondern Kunst, die Emotionen und Details sichtbar macht. 
                                                Mit einem minimalistischen Ansatz und einem Auge für das Besondere wird jedes Projekt für mich einzigartig und mit größter Sorgfalt umgesetzt. 
                                                Ich freue mich darauf, deine besonderen Momente bald für dich festzuhalten!
                                            </em>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </AnimatedSection>

                        {/* Contact Section */}
                        <AnimatedSection animation="slide-up" delay={0.3}>
                            <div className="text-center mb-16">
                                <h2 className="text-2xl font-bold uppercase tracking-wider mb-8">
                                    Lass uns sprechen
                                </h2>
                                
                                <div className="space-y-6">
                                    <div className="flex items-center justify-center">
                                        <Mail size={20} className="mr-3" />
                                        <a
                                            href="mailto:hello@nicolasklein.photography?subject=Fotografie%20Anfrage&body=Hallo%20Nicolas,%0A%0Aich%20würde%20gerne%20über%20deine%20Fotografie-Services%20sprechen.%0A%0AViele%20Grüße"
                                            className="text-lg hover:underline font-light"
                                        >
                                            hello@nicolasklein.photography
                                        </a>
                                    </div>
                                    
                                    <div className="flex items-center justify-center">
                                        <MapPin size={20} className="mr-3" />
                                        <span className="text-lg font-light">Saarbrücken, Deutschland</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-center">
                                        <Instagram size={20} className="mr-3" />
                                        <a
                                            href="https://www.instagram.com/hey.nicolasklein/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg hover:underline font-light"
                                        >
                                            @hey.nicolasklein
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Services Section */}
                        <AnimatedSection animation="slide-up" delay={0.4}>
                            <div className="text-center mb-16">
                                <h3 className="text-xl font-semibold uppercase tracking-wider mb-6">
                                    Spezialisierungen
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                                    <div className="text-center group">
                                        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gradient-to-br from-black to-gray-700 text-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1 group-hover:shadow-lg group-active:scale-95 group-active:translate-y-0.5 group-active:brightness-95 group-active:from-gray-900 group-active:to-black">
                                            <Aperture size={22} />
                                        </div>
                                        <h4 className="font-medium uppercase tracking-wider mb-2">Porträts</h4>
                                        <p className="text-sm font-light text-gray-600">
                                            Authentische & natürliche Porträtfotografie
                                        </p>
                                    </div>
                                    
                                    <div className="text-center group">
                                        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gradient-to-br from-black to-gray-700 text-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-1 group-hover:shadow-lg group-active:scale-95 group-active:translate-y-0.5 group-active:brightness-95 group-active:from-gray-900 group-active:to-black">
                                            <PartyPopper size={22} />
                                        </div>
                                        <h4 className="font-medium uppercase tracking-wider mb-2">Events</h4>
                                        <p className="text-sm font-light text-gray-600">
                                            Hochzeiten, Feiern & besondere Momente
                                        </p>
                                    </div>
                                    
                                    <div className="text-center group">
                                        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gradient-to-br from-black to-gray-700 text-white flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:-rotate-1 group-hover:shadow-lg group-active:scale-95 group-active:translate-y-0.5 group-active:brightness-95 group-active:from-gray-900 group-active:to-black">
                                            <Trophy size={22} />
                                        </div>
                                        <h4 className="font-medium uppercase tracking-wider mb-2">Sport</h4>
                                        <p className="text-sm font-light text-gray-600">
                                            Mannschafts- & Vereinsfotos
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Call to Action */}
                        <AnimatedSection animation="fade" delay={0.5}>
                            <div className="text-center">
                                <p className="text-lg font-light mb-8 text-gray-600">
                                    Bereit für dein nächstes Fotoshooting?
                                </p>
                                
                                <ContactActionButton 
                                    text="Erinnerungen schaffen"
                                    variant="dark"
                                />
                            </div>
                        </AnimatedSection>
                    </div>
                </AnimatedSection>
            </section>
        </main>
    );
} 