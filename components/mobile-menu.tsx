"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface MobileMenuProps {
    links: {
        href: string;
        label: string;
        active?: boolean;
    }[];
}

export default function MobileMenu({ links }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const menuVariants = {
        closed: {
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        open: {
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    };

    const contentVariants = {
        closed: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.3,
            },
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                delay: 0.15,
            },
        },
    };

    if (!isMounted) return (
        <div className="md:hidden">
            <button className="p-2 text-black">
                <Menu size={24} />
            </button>
        </div>
    );

    return (
        <>
            <div className="md:hidden w-[40px] h-[40px] flex items-center justify-center">
                {!isOpen && (
                    <button
                        onClick={toggleMenu}
                        className="p-2 text-black focus:outline-none z-[10000] relative mobile-menu-button flex items-center justify-center w-[40px] h-[40px]"
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>
                )}
            </div>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="fixed z-[9999] bg-white/95 backdrop-blur-2xl text-black"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: "100vw",
                                minHeight: "100vh",
                                minHeight: "100dvh",
                            }}
                        >
                            {/* Header with close button */}
                            <div className="mx-4 md:mx-8 px-4 py-4 md:py-6 flex justify-between items-center">
                                <div className="min-w-0 pr-2 md:pr-8">
                                    <span className="block max-w-[60vw] sm:max-w-none truncate whitespace-nowrap text-xl font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase text-black">
                                        NICOLAS KLEIN
                                    </span>
                                </div>
                                <button
                                    onClick={toggleMenu}
                                    className="p-2 text-black focus:outline-none z-[10000] relative"
                                    aria-label="Close menu"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Main content centered */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="flex flex-col items-center justify-center"
                                    variants={contentVariants}
                                >
                                    <div className="flex flex-col space-y-8 items-center">
                                        {links.map((link, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    transition: {
                                                        delay: 0.3 + index * 0.1,
                                                        duration: 0.3,
                                                    },
                                                }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className={`text-2xl ${
                                                        link.active
                                                            ? "font-medium border-b border-black"
                                                            : "font-light"
                                                    } hover:scale-105 transition-transform`}
                                                    onClick={toggleMenu}
                                                >
                                                    {link.label}
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Footer at bottom */}
                            <div className="absolute left-0 right-0" style={{ bottom: "max(2rem, calc(2rem + env(safe-area-inset-bottom)))" }}>
                                <motion.div
                                    className="text-center text-sm text-gray-600"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.3 }}
                                >
                                    <div className="space-y-2">
                                        <p>
                                            © {new Date().getFullYear()} Nicolas Klein Photography
                                        </p>
                                        <div className="flex justify-center space-x-4">
                                            <Link
                                                href="/impressum"
                                                className="hover:text-black transition-colors"
                                                onClick={toggleMenu}
                                            >
                                                Impressum
                                            </Link>
                                            <Link
                                                href="https://www.instagram.com/hey.nicolasklein/"
                                                className="hover:text-black transition-colors"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Instagram
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
