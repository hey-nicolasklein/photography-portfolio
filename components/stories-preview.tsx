"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/animated-section";
import AnimatedButton from "@/components/animated-button";
import TiltCard from "@/components/tilt-card";
import type { Story } from "@/types";

interface StoriesPreviewProps {
    stories: Story[];
}

export default function StoriesPreview({ stories }: StoriesPreviewProps) {
    const previewStories = stories.slice(0, 3);

    return (
        <div className="container mx-auto px-4 py-16 mb-16">
            <section>
                {/* Section Header */}
                <AnimatedSection>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold uppercase tracking-wider mb-4">
                            Meine Projekte
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Entdecke eine Auswahl meiner neuesten Arbeiten – von Events und Porträts bis hin zu besonderen Momenten, die Geschichten erzählen.
                        </p>
                    </div>
                </AnimatedSection>

                {/* Stories Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {previewStories.map((story, index) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.2,
                                ease: "easeOut"
                            }}
                        >
                            <TiltCard className="h-[400px]" tiltAmount={2}>
                                <div className="relative h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden shadow-xl border border-gray-200/80 hover:shadow-2xl transition-shadow duration-500">
                                    {/* Image Container */}
                                    <div className="relative h-[60%] overflow-hidden">
                                        {story.images && story.images.length > 0 && (
                                            <Image
                                                src={story.images[0].url}
                                                alt={story.images[0].alt || story.title}
                                                fill
                                                className="object-cover transition-transform duration-700"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        )}
                                        {/* Gradient overlay */}
                                        {/* <div className="absolute bottom-4 left-0 right-0 h-1/4 bg-gradient-to-t from-white to-transparent"></div> */}
                                        
                                        {/* Image count badge */}
                                        <div className="absolute top-4 right-4 bg-gray-900/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                            {story.images?.length || 0} Bilder
                                        </div>
                                    </div>
                                    
                                    {/* Content Container */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/95 backdrop-blur-sm">
                                        <div className="space-y-3">
                                            <h3 className="font-bold text-xl leading-tight">
                                                {story.title}
                                            </h3>
                                            <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
                                                {story.description}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
                                                <span className="font-medium">
                                                    {new Date(story.createdAt).toLocaleDateString('de-DE', {
                                                        year: 'numeric',
                                                        month: 'long'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>

                {/* Call to Action */}
                <AnimatedSection>
                    <div className="text-center">
                        <AnimatedButton
                            icon={ArrowRight}
                            href="/portfolio"
                        >
                            Alle Projekte ansehen
                        </AnimatedButton>
                    </div>
                </AnimatedSection>
            </section>
        </div>
    );
} 