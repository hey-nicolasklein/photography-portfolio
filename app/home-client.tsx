"use client";

import Link from "next/link";
import Image from "next/image";
import PhotoGallery from "@/components/photo-gallery";
import Header from "@/components/header";
import AnimatedSection from "@/components/animated-section";
import ParallaxSection from "@/components/parallax-section";
import StoriesPreview from "@/components/stories-preview";
import type { GalleryItem, BioItem, Story } from "@/types";

interface HomeClientProps {
    galleryItems: GalleryItem[];
    bio: BioItem | null;
    stories: Story[];
}

export default function HomeClient({ galleryItems, bio, stories }: HomeClientProps) {
    return (
        <main className="min-h-screen bg-white text-black">
            <Header currentPage="home" />

            {/* Hero Gallery Section */}
            <div className="mb-16">
                <section>
                    {galleryItems && galleryItems.length > 0 ? (
                        <PhotoGallery galleryItems={galleryItems} />
                    ) : (
                        <div className="container mx-auto px-4 text-center py-8">
                            <p className="text-gray-500">No gallery items available</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Stories Preview Section */}
            {stories && stories.length > 0 ? (
                <StoriesPreview stories={stories} />
            ) : (
                <div className="container mx-auto px-4 text-center py-8">
                    <p className="text-gray-500">No stories available</p>
                </div>
            )}

            {/* About Section */}
            <div className="container mx-auto px-4 py-8 mb-16">
                <section>
                    <div className="grid md:grid-cols-5 gap-8 items-center">
                        <div className="md:col-span-2">
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
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <h2 className="text-3xl font-bold uppercase mb-4 tracking-wider">
                                Über mich
                            </h2>
                            <h3 className="text-xl text-gray-700 mb-6">
                                {bio?.title || "FREIBERUFLICHER FOTOGRAF"}
                            </h3>

                            <div className="text-sm space-y-4">
                                <div className="leading-relaxed whitespace-pre-wrap break-words">
                                    {bio?.description ||
                                        "Ich halte Momente fest, die Geschichten erzählen – mit einem minimalistischen Blick in Schwarzweiß. Spezialisiert auf Porträts, Events und kommerzielle Fotografie mit einem künstlerischen Ansatz, der Komposition und Emotion in den Vordergrund stellt."}
                                </div>

                                <p className="text-sm text-gray-700">
                                    {bio?.tags ||
                                        "porträts / events / hochzeiten / commercial / editorial / travel / architektur"}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Contact Section */}
            <div className="container mx-auto px-4 py-16 mb-16 bg-gray-50">
                <section id="contact">
                    <h2 className="text-3xl font-bold uppercase mb-8 text-center tracking-wider">
                        Kontakt
                    </h2>

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
                </section>
            </div>

            <footer className="bg-white border-t border-gray-200">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-gray-500 mb-4 md:mb-0 font-light tracking-wider uppercase">
                            © {new Date().getFullYear()} Nicolas Klein
                            Photography
                        </p>
                        <div className="flex space-x-6">
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
                </div>
            </footer>
        </main>
    );
} 