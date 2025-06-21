"use client";

import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/animated-section";
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
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold uppercase tracking-wider mb-4">
                        Meine Projekte
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Entdecke eine Auswahl meiner neuesten Arbeiten – von Events und Porträts bis hin zu besonderen Momenten, die Geschichten erzählen.
                    </p>
                </div>

                {/* Stories Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {previewStories.map((story, index) => (
                        <div key={story.id} className="group">
                            <div className="relative h-[300px] mb-4 overflow-hidden">
                                {story.images && story.images.length > 0 && (
                                    <Image
                                        src={story.images[0].url}
                                        alt={story.images[0].alt || story.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg leading-tight">
                                    {story.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-3">
                                    {story.description}
                                </p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>
                                        {new Date(story.createdAt).toLocaleDateString('de-DE', {
                                            year: 'numeric',
                                            month: 'long'
                                        })}
                                    </span>
                                    <span>
                                        {story.images?.length || 0} Bilder
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <Link
                        href="/portfolio"
                        className="inline-block bg-black text-white px-8 py-3 uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors duration-300 hover:scale-105 transform"
                    >
                        Alle Projekte ansehen
                    </Link>
                </div>
            </section>
        </div>
    );
} 