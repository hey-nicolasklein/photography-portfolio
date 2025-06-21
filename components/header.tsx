"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import MobileMenu from "@/components/mobile-menu";

interface HeaderProps {
    currentPage?: "home" | "portfolio" | "pricing";
}

export default function Header({ currentPage = "home" }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll for header blur effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
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
                        className={`text-sm font-${currentPage === "home" ? "medium" : "light"} tracking-wider uppercase ${
                            currentPage === "home" 
                                ? "border-b border-black transition-none"
                                : "hover:border-b hover:border-black transition-none"
                        }`}
                    >
                        startseite
                    </Link>
                    <Link
                        href="/portfolio"
                        className={`text-sm font-${currentPage === "portfolio" ? "medium" : "light"} tracking-wider uppercase ${
                            currentPage === "portfolio" 
                                ? "border-b border-black transition-none"
                                : "hover:border-b hover:border-black transition-none"
                        }`}
                    >
                        portfolio
                    </Link>
                    <Link
                        href="/pricing"
                        className={`text-sm font-${currentPage === "pricing" ? "medium" : "light"} tracking-wider uppercase ${
                            currentPage === "pricing" 
                                ? "border-b border-black transition-none"
                                : "hover:border-b hover:border-black transition-none"
                        }`}
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
                                active: currentPage === "home",
                            },
                            { 
                                href: "/portfolio", 
                                label: "portfolio",
                                active: currentPage === "portfolio"
                            },
                            { 
                                href: "/pricing", 
                                label: "preise",
                                active: currentPage === "pricing"
                            },
                        ]}
                    />
                </div>
            </div>
        </header>
    );
} 