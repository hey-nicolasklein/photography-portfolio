"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
    links: {
        href: string;
        label: string;
        active?: boolean;
    }[];
}

export default function MobileMenu({ links }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Handle body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
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

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-[9999] backdrop-blur-xl bg-white/90 text-black flex items-center justify-center"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <motion.div
                            className="flex flex-col justify-center items-center w-full"
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

                        <motion.div
                            className="fixed bottom-8 left-0 right-0 text-center text-sm text-gray-600"
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
