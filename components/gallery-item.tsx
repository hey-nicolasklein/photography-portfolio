"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";

interface GalleryItemProps {
    photo: {
        src: string;
        alt: string;
        category?: string;
    };
    index: number;
    onClick: () => void;
}

export default function GalleryItem({
    photo,
    index,
    onClick,
}: GalleryItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: ((e.clientX - rect.left) / rect.width) * 2 - 1, // -1 to 1
            y: ((e.clientY - rect.top) / rect.height) * 2 - 1, // -1 to 1
        });
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick();
    };

    return (
        <div
            className="w-full h-full relative cursor-pointer overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >
            <motion.div
                className="w-full h-full"
                animate={{
                    scale: isHovered ? 1.05 : 1,
                    x: isHovered ? mousePosition.x * 5 : 0,
                    y: isHovered ? mousePosition.y * 5 : 0,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <Image
                    src={photo.src || "/placeholder.svg"}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 33vw"
                    priority={index < 3} // Prioritize loading first 3 images
                    fetchPriority="high"
                />
            </motion.div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="flex flex-col items-center gap-3"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <motion.div
                                className="bg-white/90 text-black px-4 py-2 rounded-sm flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ZoomIn size={16} />
                                <span className="text-sm font-medium">
                                    View
                                </span>
                            </motion.div>

                            {photo.category && (
                                <motion.span
                                    className="text-white text-xs bg-black/50 px-3 py-1 rounded-full"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    {photo.category}
                                </motion.span>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="absolute inset-0 border-2 border-transparent"
                animate={{
                    borderColor: isHovered
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(255, 255, 255, 0)",
                }}
                transition={{ duration: 0.3 }}
            />
        </div>
    );
}
