"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MobileMenu from "@/components/mobile-menu";

interface HeaderProps {
    currentPage?: "home" | "portfolio" | "kontakt";
}

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
}

function AnimatedNavLink({ href, children, isActive }: NavLinkProps) {
    return (
        <Link href={href} className="relative">
            <motion.span
                className={`text-sm font-${isActive ? "medium" : "light"} tracking-wider uppercase block relative overflow-hidden text-black`}
                whileHover={{
                    scale: 1.05,
                    transition: {
                        duration: 0.2,
                        ease: "easeOut"
                    }
                }}
                whileTap={{
                    scale: 0.98,
                    transition: {
                        duration: 0.1,
                        ease: "easeInOut"
                    }
                }}
            >
                {children}
                
                {/* Active state underline */}
                {isActive && (
                    <motion.div
                        className="absolute bottom-0 left-0 h-[1px] bg-black"
                        initial={{ width: "100%" }}
                        layoutId="activeUnderline"
                        transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30
                        }}
                    />
                )}
                
                {/* Hover state underline */}
                {!isActive && (
                    <motion.div
                        className="absolute bottom-0 left-0 h-[1px] bg-black"
                        initial={{ width: 0 }}
                        whileHover={{
                            width: "100%",
                            transition: {
                                duration: 0.3,
                                ease: "easeInOut"
                            }
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut"
                        }}
                    />
                )}
            </motion.span>
        </Link>
    );
}

export default function Header({ currentPage = "home" }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-[55] transition-all duration-300 ${
                scrolled
                    ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100"
                    : "bg-white"
            }`}
        >
            <div className="mx-8 px-4 py-6 flex justify-between items-center">
                <div className="flex-shrink-0 pr-8">
                    <Link
                        href="/"
                        className="text-xl font-black tracking-[0.2em] hover:opacity-80 transition-opacity uppercase text-black"
                    >
                        NICOLAS KLEIN
                    </Link>
                </div>
                
                <div className="flex items-center space-x-8">
                    <nav className="hidden md:flex space-x-8 items-center">
                        <AnimatedNavLink
                            href="/"
                            isActive={currentPage === "home"}
                        >
                            startseite
                        </AnimatedNavLink>
                        
                        <AnimatedNavLink
                            href="/portfolio"
                            isActive={currentPage === "portfolio"}
                        >
                            projekte
                        </AnimatedNavLink>
                        
                        <AnimatedNavLink
                            href="/kontakt"
                            isActive={currentPage === "kontakt"}
                        >
                            kontakt
                        </AnimatedNavLink>
                    </nav>
                    
                    <div className="flex items-center space-x-4" style={{ position: 'relative', zIndex: 100 }}>
                        <motion.div
                            whileHover={{
                                scale: 1.1,
                                rotate: [0, -5, 5, 0],
                                transition: {
                                    scale: {
                                        duration: 0.2,
                                        ease: "easeOut"
                                    },
                                    rotate: {
                                        duration: 0.6,
                                        ease: "easeInOut"
                                    }
                                }
                            }}
                            whileTap={{
                                scale: 0.9,
                                transition: {
                                    duration: 0.1,
                                    ease: "easeInOut"
                                }
                            }}
                        >
                            <Link
                                href="https://www.instagram.com/hey.nicolasklein/"
                                className="text-black transition-colors duration-300"
                                aria-label="Instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Instagram size={20} />
                            </Link>
                        </motion.div>
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
                                    href: "/kontakt", 
                                    label: "kontakt",
                                    active: currentPage === "kontakt"
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}