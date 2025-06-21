"use client";

import { motion } from "framer-motion";
import { ArrowRight, Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Story } from "@/types";

interface StoriesCardProps {
    stories: Story[];
}

export default function StoriesCard({ stories }: StoriesCardProps) {
    // Get 2 random stories for preview
    const shuffledStories = [...stories].sort(() => Math.random() - 0.5);
    const previewStories = shuffledStories.slice(0, 2);
    const hasMoreStories = stories.length > 2;

    return (
        <motion.div
            className="mb-2 break-inside-avoid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.4,
                ease: "easeOut"
            }}
        >
            <div className="bg-gray-900 text-white h-full flex flex-col min-h-[650px]">
                {/* Header */}
                <div className="p-8 border-b border-gray-700">
                    <div className="flex items-center mb-3">
                        <Camera size={24} className="mr-3" />
                        <h3 className="text-2xl font-bold uppercase tracking-wider">
                            Portfolio Projekte
                        </h3>
                    </div>
                    <p className="text-gray-300 text-base">
                        Entdecke meine neuesten Arbeiten und Projektstorys
                    </p>
                </div>

                {/* Stories Preview Grid */}
                <div className="flex-1 p-8">
                    {previewStories.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                {/* First story */}
                                <div className="group cursor-pointer">
                                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                                        {previewStories[0].images.length > 0 ? (
                                            <Image
                                                src={previewStories[0].images[0].url}
                                                alt={previewStories[0].images[0].alt}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                sizes="(max-width: 500px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                                <Camera size={32} className="text-gray-500" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg" />
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-base font-semibold mb-2 group-hover:text-gray-300 transition-colors line-clamp-2">
                                            {previewStories[0].title}
                                        </h4>
                                        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                                            {previewStories[0].description}
                                        </p>
                                    </div>
                                </div>

                                {/* Second story */}
                                {previewStories[1] ? (
                                    <div className="group cursor-pointer">
                                        <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                                            {previewStories[1].images.length > 0 ? (
                                                <Image
                                                    src={previewStories[1].images[0].url}
                                                    alt={previewStories[1].images[0].alt}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    sizes="(max-width: 500px) 50vw, 25vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                                    <Camera size={32} className="text-gray-500" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg" />
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-base font-semibold mb-2 group-hover:text-gray-300 transition-colors line-clamp-2">
                                                {previewStories[1].title}
                                            </h4>
                                            <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                                                {previewStories[1].description}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-700 rounded-lg h-48"></div>
                                )}
                            </div>

                            {/* Placeholder boxes that fade out */}
                            {hasMoreStories && (
                                <div className="grid grid-cols-2 gap-6 relative">
                                    {/* Third story image */}
                                    <div className="bg-gray-700 rounded-lg h-32 overflow-hidden relative">
                                        {shuffledStories[2] && shuffledStories[2].images.length > 0 ? (
                                            <Image
                                                src={shuffledStories[2].images[0].url}
                                                alt={shuffledStories[2].images[0].alt}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 500px) 50vw, 25vw"
                                            />
                                        ) : null}
                                    </div>
                                    
                                    {/* Fourth story image */}
                                    <div className="bg-gray-700 rounded-lg h-32 overflow-hidden relative">
                                        {shuffledStories[3] && shuffledStories[3].images.length > 0 ? (
                                            <Image
                                                src={shuffledStories[3].images[0].url}
                                                alt={shuffledStories[3].images[0].alt}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 500px) 50vw, 25vw"
                                            />
                                        ) : null}
                                    </div>
                                    
                                    {/* Fade overlay with button */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent flex items-end justify-center pb-4">
                                        <Link 
                                            href="/portfolio"
                                            className="inline-flex items-center justify-center bg-white text-black px-6 py-3 uppercase tracking-wider text-sm font-semibold hover:bg-gray-100 transition-colors duration-300 group rounded-sm"
                                        >
                                            Alle Projekte ansehen
                                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-gray-400 py-16">
                            <Camera size={48} className="mx-auto mb-4 text-gray-600" />
                            <p className="text-base mb-2">Neue Projekte kommen bald...</p>
                            <p className="text-sm">Schau gerne später wieder vorbei</p>
                        </div>
                    )}
                </div>

                {/* Bottom CTA (fallback) */}
                {!hasMoreStories && previewStories.length > 0 && (
                    <div className="p-8 border-t border-gray-700">
                        <Link 
                            href="/portfolio"
                            className="w-full inline-flex items-center justify-center bg-white text-black px-8 py-4 uppercase tracking-wider text-base font-semibold hover:bg-gray-100 transition-colors duration-300 group rounded-sm"
                        >
                            Alle Projekte ansehen
                            <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                        </Link>
                    </div>
                )}
            </div>
        </motion.div>
    );
} 