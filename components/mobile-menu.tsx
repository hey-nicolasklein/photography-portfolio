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

    // Mount check for SSR
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // Handle body scroll lock and positioning
    useEffect(() => {
        if (isOpen) {
            // Store current scroll position
            const scrollY = window.scrollY;

            // Lock body scroll
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
            document.body.style.overflow = "hidden";
        } else {
            // Restore scroll position
            const scrollY = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "";

            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || "0") * -1);
            }
        }

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
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

    const menuContent = isOpen ? (
        <motion.div
            className="fixed top-0 left-0 right-0 bottom-0 z-[9999] bg-white/95 backdrop-blur-2xl text-black"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            style={{
                height: "100vh",
                height: "100dvh",
                width: "100vw",
                position: "fixed",
            }}
        >
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
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Footer at bottom */}
            <div className="absolute bottom-8 left-0 right-0">
                <motion.div
                    className="text-center text-sm text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    <div className="space-y-2">
                        <p>
                            © {new Date().getFullYear()} Nicolas Klein
                            Photography
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                href="/impressum"
                                className="hover:text-black transition-colors"
                                onClick={closeMenu}
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
    ) : null;

    return (
        <div className="md:hidden">
            <button
                onClick={toggleMenu}
                className="p-2 text-black focus:outline-none z-[10000] relative mobile-menu-button"
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isMounted && (
                <AnimatePresence>
                    {menuContent && createPortal(menuContent, document.body)}
                </AnimatePresence>
            )}
        </div>
    );
}
