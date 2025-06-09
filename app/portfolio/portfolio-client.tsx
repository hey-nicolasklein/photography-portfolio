"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import MobileMenu from "@/components/mobile-menu";
import AnimatedSection from "@/components/animated-section";
import LightboxPortal from "@/components/lightbox-portal";
import StoryCard from "@/components/story-card";
import type { Story } from "@/types";

export default function PortfolioClient({ stories }: { stories: Story[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImages, setCurrentImages] = useState<
        Array<{ src: string; alt: string }>
    >([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    const openLightbox = (
        imageIndex: number,
        storyImages: Array<{ src: string; alt: string }>
    ) => {
        setCurrentImages(storyImages);
        setCurrentIndex(imageIndex);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setCurrentImages([]);
        setCurrentIndex(0);
    };

    // Handle scroll for header blur effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <main className="min-h-screen bg-white text-black">
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100"
                        : "bg-white"
                }`}
            >
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-xl font-light tracking-[0.2em] hover:opacity-80 transition-opacity uppercase"
                    >
                        NICOLAS KLEIN
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            href="/"
                            className="text-sm font-light tracking-wider uppercase hover:border-b hover:border-black transition-none"
                        >
                            startseite
                        </Link>
                        <Link
                            href="/portfolio"
                            className="text-sm font-medium tracking-wider uppercase border-b border-black transition-none"
                        >
                            portfolio
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-sm font-light tracking-wider uppercase hover:border-b hover:border-black transition-none"
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
                                {
                                    href: "/portfolio",
                                    label: "portfolio",
                                    active: true,
                                },
                                { href: "/pricing", label: "preise" },
                            ]}
                        />
                    </div>
                </div>
            </header>

            {/* Stories Section */}
            <section className="py-8">
                <AnimatedSection animation="slide-up" delay={0.1}>
                    {stories.length > 0 ? (
                        <div>
                            {stories.map((story, index) => (
                                <div key={story.documentId}>
                                    <StoryCard
                                        story={story}
                                        index={index}
                                        onImageClick={openLightbox}
                                    />
                                    {/* Separator between stories */}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="container mx-auto px-4 text-center py-20">
                            <div className="text-6xl mb-6 opacity-30">📸</div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                                Noch keine Projekte verfügbar
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Neue Geschichten und Projekte werden bald hier
                                zu sehen sein.
                            </p>
                        </div>
                    )}
                </AnimatedSection>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-20">
                <div className="container mx-auto px-4 py-12">
                    <AnimatedSection animation="fade">
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
                    </AnimatedSection>
                </div>
            </footer>

            <LightboxPortal
                images={currentImages}
                initialIndex={currentIndex}
                isOpen={lightboxOpen}
                onClose={closeLightbox}
            />
        </main>
    );
}
