"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface MobileMenuProps {
    links: {
        href: string;
        label: string;
        active?: boolean;
    }[];
}

function AnimatedHamburger({ isOpen }: { isOpen: boolean }) {
    const topLineVariants = {
        closed: {
            rotate: 0,
            y: -5,
        },
        open: {
            rotate: 45,
            y: 0,
        },
    };

    const middleLineVariants = {
        closed: {
            opacity: 1,
            scaleX: 1,
        },
        open: {
            opacity: 0,
            scaleX: 0,
        },
    };

    const bottomLineVariants = {
        closed: {
            rotate: 0,
            y: 5,
        },
        open: {
            rotate: -45,
            y: 0,
        },
    };

    const transition = {
        type: "spring",
        stiffness: 400,
        damping: 30,
    };

    return (
        <div className="w-6 h-6 flex flex-col justify-center items-center relative">
            <motion.span
                className="absolute w-6 h-[2px] bg-black rounded-full origin-center"
                style={{ top: "50%", left: "50%", marginLeft: "-12px", marginTop: "-1px" }}
                variants={topLineVariants}
                animate={isOpen ? "open" : "closed"}
                transition={transition}
            />
            <motion.span
                className="absolute w-6 h-[2px] bg-black rounded-full origin-center"
                style={{ top: "50%", left: "50%", marginLeft: "-12px", marginTop: "-1px" }}
                variants={middleLineVariants}
                animate={isOpen ? "open" : "closed"}
                transition={transition}
            />
            <motion.span
                className="absolute w-6 h-[2px] bg-black rounded-full origin-center"
                style={{ top: "50%", left: "50%", marginLeft: "-12px", marginTop: "-1px" }}
                variants={bottomLineVariants}
                animate={isOpen ? "open" : "closed"}
                transition={transition}
            />
        </div>
    );
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
                <AnimatedHamburger isOpen={false} />
            </button>
        </div>
    );

    return (
        <>
            <div className="md:hidden w-[40px] h-[40px] flex items-center justify-center">
                <motion.button
                    onClick={toggleMenu}
                    className="p-2 text-black focus:outline-none z-[10000] relative mobile-menu-button flex items-center justify-center w-[40px] h-[40px]"
                    aria-label={isOpen ? "Close menu" : "Open menu"}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <AnimatedHamburger isOpen={isOpen} />
                </motion.button>
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
                            }}
                        >
                            {/* Header with close button */}
                            <div className="mx-4 md:mx-8 px-4 py-4 md:py-6 flex justify-between items-center">
                                <div className="min-w-0 pr-2 md:pr-8">
                                    <span className="block max-w-[60vw] sm:max-w-none truncate whitespace-nowrap text-xl font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase text-black">
                                        NICOLAS KLEIN
                                    </span>
                                </div>
                                <motion.button
                                    onClick={toggleMenu}
                                    className="p-2 text-black focus:outline-none z-[10000] relative w-[40px] h-[40px] flex items-center justify-center"
                                    aria-label="Close menu"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ 
                                        opacity: 0, 
                                        scale: 0.8,
                                        transition: { 
                                            duration: 0.25,
                                            ease: "easeInOut"
                                        } 
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <AnimatedHamburger isOpen={isOpen} />
                                </motion.button>
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
