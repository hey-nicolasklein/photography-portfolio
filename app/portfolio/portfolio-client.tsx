"use client";

import Link from "next/link";
import { useState } from "react";
import Header from "@/components/header";
import AnimatedSection from "@/components/animated-section";
import LightboxPortal from "@/components/lightbox-portal";
import StoryCard from "@/components/story-card";
import BackToTop from "@/components/back-to-top";
import type { Story } from "@/types";

export default function PortfolioClient({ stories }: { stories: Story[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImages, setCurrentImages] = useState<
        Array<{ src: string; alt: string }>
    >([]);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    return (
        <main className="min-h-screen bg-white text-black">
            <Header currentPage="portfolio" />

            {/* Stories Section */}
            <section className="py-8">
                {stories.length > 0 ? (
                    <div>
                        {stories.map((story, index) => (
                            <AnimatedSection 
                                key={story.documentId}
                                animation="slide-up" 
                                delay={index * 0.1}
                            >
                                <StoryCard
                                    story={story}
                                    index={index}
                                    onImageClick={openLightbox}
                                />
                                {/* Separator between stories */}
                            </AnimatedSection>
                        ))}
                    </div>
                ) : (
                    <AnimatedSection animation="fade">
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
                    </AnimatedSection>
                )}
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
            <BackToTop />
        </main>
    );
}
