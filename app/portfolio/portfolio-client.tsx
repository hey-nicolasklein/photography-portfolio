"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import MobileMenu from "@/components/mobile-menu";
import AnimatedSection from "@/components/animated-section";
import LightboxPortal from "@/components/lightbox-portal";
import PortfolioItem from "@/components/portfolio-item";
import { useLightbox } from "@/hooks/use-lightbox";

type PortfolioItemType = {
    id: number;
    title: string;
    category: string;
    image: string;
    alt?: string;
};

export default function PortfolioClient({
    portfolioItems,
}: {
    portfolioItems: PortfolioItemType[];
}) {
    const { lightboxOpen, currentIndex, openLightbox, closeLightbox } =
        useLightbox();
    const lightboxImages = portfolioItems.map((item) => ({
        src: item.image,
        alt: item.alt || item.title,
    }));

    return (
        <main className="min-h-screen bg-white text-black">
            <header className="bg-white z-50 container mx-auto px-4 py-8 flex justify-between items-center">
                <h1 className="text-xl font-light tracking-wider">
                    NICOLAS KLEIN
                </h1>
                <nav className="hidden md:flex space-x-8">
                    <Link
                        href="/"
                        className="text-sm hover:border-b hover:border-black transition-none"
                    >
                        home
                    </Link>
                    <Link
                        href="/portfolio"
                        className="text-sm border-b border-black transition-none"
                    >
                        portfolio
                    </Link>
                    <Link
                        href="/pricing"
                        className="text-sm hover:border-b hover:border-black transition-none"
                    >
                        pricing
                    </Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <Link
                        href="https://instagram.com"
                        className="text-black"
                        aria-label="Instagram"
                    >
                        <Instagram size={20} />
                    </Link>
                    <MobileMenu
                        links={[
                            { href: "/", label: "home" },
                            {
                                href: "/portfolio",
                                label: "portfolio",
                                active: true,
                            },
                            { href: "/pricing", label: "pricing" },
                        ]}
                    />
                </div>
            </header>

            <section className="container mx-auto px-4 py-16">
                <AnimatedSection animation="fade">
                    <h2 className="text-3xl font-bold uppercase mb-8 text-center">
                        PORTFOLIO
                    </h2>
                </AnimatedSection>

                <AnimatedSection animation="slide-up" delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portfolioItems.map((item, index) => (
                            <PortfolioItem
                                key={item.id}
                                item={item}
                                onClick={() => openLightbox(index)}
                            />
                        ))}
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
                                href="#"
                                className="text-sm text-gray-500 hover:text-black"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="#"
                                className="text-sm text-gray-500 hover:text-black"
                            >
                                Terms
                            </Link>
                            <Link
                                href="#"
                                className="text-sm text-gray-500 hover:text-black"
                            >
                                Instagram
                            </Link>
                        </div>
                    </div>
                </AnimatedSection>
            </footer>

            <LightboxPortal
                images={lightboxImages}
                initialIndex={currentIndex}
                isOpen={lightboxOpen}
                onClose={closeLightbox}
            />
        </main>
    );
}
