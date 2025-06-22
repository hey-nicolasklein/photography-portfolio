"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Calendar, Eye, Play } from "lucide-react";
import { motion } from "framer-motion";
import type { Story } from "@/types";

interface StoryCardProps {
    story: Story;
    index: number;
    onImageClick: (
        imageIndex: number,
        storyImages: Array<{ src: string; alt: string }>
    ) => void;
}

export default function StoryCard({
    story,
    index,
    onImageClick,
}: StoryCardProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(
        new Set()
    );

    const handleImageError = (imageId: number) => {
        setImageLoadErrors((prev) => new Set(prev).add(imageId));
    };

    const handleImageClick = (imageIndex: number) => {
        const storyImages = story.images.map((img) => ({
            src: img.url,
            alt: img.alt,
        }));
        onImageClick(imageIndex, storyImages);
    };

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
            checkScrollability();

            // Only add resize listener, not load
            window.addEventListener("resize", checkScrollability);

            return () => {
                el.removeEventListener("scroll", checkScrollability);
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

    if (story.images.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="text-4xl mb-4 opacity-30">📸</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {story.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                        {story.description}
                    </p>
                    <div className="text-xs text-gray-400">
                        Keine Bilder verfügbar
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-16">
            {/* Full-width Image Gallery */}
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    <div className="flex">
                        {story.images.map((image, imageIndex) => (
                            <motion.div
                                key={image.id}
                                className="min-w-[85vw] md:min-w-[40vw] lg:min-w-[33.33vw] h-[50vh] md:h-[70vh] flex-shrink-0 snap-center px-1"
                            >
                                <div
                                    className="relative w-full h-full cursor-pointer group overflow-hidden rounded-lg bg-gray-100"
                                    onClick={() => handleImageClick(imageIndex)}
                                >
                                    {!imageLoadErrors.has(image.id) ? (
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            sizes="(max-width: 768px) 85vw, (max-width: 1024px) 40vw, 33vw"
                                            loading="lazy"

                                            onError={() =>
                                                handleImageError(image.id)
                                            }
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400 text-sm text-center px-4">
                                                Bild nicht verfügbar
                                            </span>
                                        </div>
                                    )}

                                    {/* Subtle hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                                                <Eye
                                                    size={20}
                                                    className="text-gray-700"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows */}
                {story.images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                scroll("left");
                            }}
                            className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-10 border border-gray-100 ${
                                !canScrollLeft
                                    ? "opacity-30 cursor-not-allowed"
                                    : "opacity-90 hover:opacity-100 hover:scale-110"
                            } transition-all duration-300`}
                            disabled={!canScrollLeft}
                            aria-label="Vorherige Bilder"
                        >
                            <ArrowLeft size={18} className="text-gray-800" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                scroll("right");
                            }}
                            className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg z-10 border border-gray-100 ${
                                !canScrollRight
                                    ? "opacity-30 cursor-not-allowed"
                                    : "opacity-90 hover:opacity-100 hover:scale-110"
                            } transition-all duration-300`}
                            disabled={!canScrollRight}
                            aria-label="Nächste Bilder"
                        >
                            <ArrowRight size={18} className="text-gray-800" />
                        </button>
                    </>
                )}
            </div>

            {/* Story Header */}
            <div className="container mx-auto px-4 mt-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-start gap-6">
                        {/* Timeline Column */}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h2 className="text-4xl md:text-3xl font-bold text-black mb-6 leading-tight">
                                {story.title}
                            </h2>

                            <p className="text-lg md:text-lg text-gray-600 leading-relaxed mb-6 break-words">
                                {story.description}
                            </p>

                            {/* Metadata */}
                            <div className="flex items-center gap-8 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>
                                        {new Date(
                                            story.createdAt
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye size={16} />
                                    <span>
                                        {story.images.length}{" "}
                                        {story.images.length === 1
                                            ? "Image"
                                            : "Images"}
                                    </span>
                                </div>
                            </div>

                            {/* View Story Button */}
                            <button
                                onClick={() => handleImageClick(0)}
                                className="group flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm font-medium"
                            >
                                <Play
                                    size={16}
                                    className="group-hover:translate-x-0.5 transition-transform"
                                />
                                View Story
                            </button>
                        </div>

                        {/* Company Logo */}
                        {story.companyLogo && (
                            <div className="flex-shrink-0">
                                <div className="relative w-20 h-12 md:w-24 md:h-14">
                                    <Image
                                        src={story.companyLogo.url}
                                        alt={
                                            story.companyLogo.alt ||
                                            "Company Logo"
                                        }
                                        fill
                                        className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                                        sizes="(max-width: 768px) 80px, 96px"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
