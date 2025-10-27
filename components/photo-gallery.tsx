"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import LightboxPortal from "./lightbox-portal";
import GalleryItem from "./gallery-item";
import { useLightbox } from "@/hooks/use-lightbox";
import type { GalleryItem as GalleryItemType } from "@/types";

interface PhotoGalleryProps {
    galleryItems: GalleryItemType[];
}

export default function PhotoGallery({ galleryItems }: PhotoGalleryProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const { lightboxOpen, currentIndex, openLightbox, closeLightbox } =
        useLightbox();

    // Use the already transformed gallery items as photos
    const photos = galleryItems.map((item) => ({
        src: item.src,
        alt: item.alt,
        category: item.category,
    }));

    // If no gallery items are available, don't render anything
    if (photos.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <p>No gallery items available</p>
            </div>
        );
    }

    const checkScrollability = () => {
        const el = scrollRef.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener("scroll", checkScrollability);
            // Initial check
            checkScrollability();

            // Check after images might have loaded
            window.addEventListener("load", checkScrollability);
            window.addEventListener("resize", checkScrollability);

            return () => {
                el.removeEventListener("scroll", checkScrollability);
                window.removeEventListener("load", checkScrollability);
                window.removeEventListener("resize", checkScrollability);
            };
        }
    }, []);

    const scroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;

        const scrollAmount = el.clientWidth * 0.8;
        const newPosition =
            direction === "left"
                ? el.scrollLeft - scrollAmount
                : el.scrollLeft + scrollAmount;

        el.scrollTo({
            left: newPosition,
            behavior: "smooth",
        });
    };

    return (
        <>
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <div className="flex">
                        {photos.map((photo, index) => (
                            <motion.div
                                key={index}
                                className="min-w-[85vw] md:min-w-[40vw] lg:min-w-[33.33vw] h-[50vh] md:h-[70vh] flex-shrink-0 snap-center px-1"
                            >
                                <GalleryItem
                                    photo={photo}
                                    index={index}
                                    onClick={() => openLightbox(index)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        scroll("left");
                    }}
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 text-black dark:text-white p-2 rounded-full ${
                        !canScrollLeft
                            ? "opacity-30 cursor-not-allowed"
                            : "opacity-80 hover:opacity-100"
                    }`}
                    disabled={!canScrollLeft}
                    aria-label="Scroll left"
                >
                    <ArrowLeft size={24} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        scroll("right");
                    }}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 text-black dark:text-white p-2 rounded-full ${
                        !canScrollRight
                            ? "opacity-30 cursor-not-allowed"
                            : "opacity-80 hover:opacity-100"
                    }`}
                    disabled={!canScrollRight}
                    aria-label="Scroll right"
                >
                    <ArrowRight size={24} />
                </button>
            </div>

            <LightboxPortal
                images={photos}
                initialIndex={currentIndex}
                isOpen={lightboxOpen}
                onClose={closeLightbox}
            />
        </>
    );
}
