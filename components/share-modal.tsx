"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Link as LinkIcon, Share2, ArrowRight, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import StyledQrCode from "@/components/styled-qr-code";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ShareModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [resolvedUrl, setResolvedUrl] = useState<string>("");
    const { toast } = useToast();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const siteOrigin =
            typeof window !== "undefined"
                ? window.location.origin
                : process.env.NEXT_PUBLIC_SITE_URL ?? "https://nicolasklein.photography";

        setResolvedUrl(siteOrigin);
    }, []);

    const canWebShare = useMemo(() => typeof navigator !== "undefined" && !!(navigator as any).share, []);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(resolvedUrl);
            toast({ title: "Link kopiert" });
        } catch {}
    }

    async function handleSystemShare() {
        try {
            if ((navigator as any).share) {
                await (navigator as any).share({
                    title: "Nicolas Klein Photography",
                    text: "Fotografie Portfolio",
                    url: resolvedUrl,
                });
            }
        } catch {}
    }

    const modalVariants = {
        closed: {
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const,
            },
        },
        open: {
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut" as const,
            },
        },
    };

    const contentVariants = {
        closed: {
            opacity: 0,
            y: 20,
            scale: 0.95,
            transition: {
                duration: 0.3,
            },
        },
        open: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                delay: 0.15,
            },
        },
    };

    if (!isMounted) return (
        <button className="text-black transition-colors duration-300">
            <Share2 size={20} />
        </button>
    );

    return (
        <>
            <button
                onClick={toggleModal}
                className="text-black transition-colors duration-300 focus:outline-none"
                aria-label="Teilen"
            >
                <Share2 size={20} />
            </button>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="fixed z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={modalVariants}
                            onClick={toggleModal}
                            style={{
                                position: "fixed",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: "100vw",
                                minHeight: "100vh",
                                minHeight: "100dvh",
                                paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
                            }}
                        >
                            <motion.div
                                className="bg-white rounded-lg shadow-2xl w-[90vw] max-w-md relative"
                                variants={contentVariants}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close button */}
                                <button
                                    onClick={toggleModal}
                                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black transition-colors focus:outline-none z-10"
                                    aria-label="Close"
                                >
                                    <X size={24} />
                                </button>

                                {/* Content */}
                                <div className="flex flex-col items-center gap-6 p-6 pt-12">
                                    <h2 className="text-2xl font-bold tracking-wider uppercase">Website Teilen</h2>

                                    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                                        <div className="aspect-square min-w-[50px] max-w-[320px] w-[150px] sm:w-[280px]">
                                            <StyledQrCode
                                                value={resolvedUrl}
                                                size={typeof window !== "undefined" && window.innerWidth >= 640 ? 280 : 150}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex w-full flex-wrap items-center justify-center gap-2">
                                        {!canWebShare && (
                                            <Button
                                                variant="outline"
                                                onClick={handleCopy}
                                                className="flex-1 min-w-[160px] group bg-white text-black border-gray-300 hover:bg-gray-50 hover:text-black"
                                            >
                                                <span className="inline-flex items-center">
                                                    <LinkIcon className="mr-2 h-4 w-4" /> Link kopieren
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </span>
                                            </Button>
                                        )}
                                        <Button asChild variant="outline" className="flex-1 min-w-[160px] group bg-white text-black border-gray-300 hover:bg-gray-50 hover:text-black">
                                            <Link
                                                href="https://www.instagram.com/hey.nicolasklein/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Instagram öffnen"
                                            >
                                                <span className="inline-flex items-center">
                                                    <Instagram className="mr-2 h-4 w-4" /> Instagram öffnen
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </span>
                                            </Link>
                                        </Button>
                                        {canWebShare && (
                                            <Button
                                                onClick={handleSystemShare}
                                                variant="outline"
                                                className="flex-1 min-w-[160px] group bg-white text-black border-gray-300 hover:bg-gray-50 hover:text-black"
                                            >
                                                <span className="inline-flex items-center">
                                                    <Share2 className="mr-2 h-4 w-4" /> Teilen
                                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
