'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageMetadata } from '@/lib/strapi';

interface ImageCanvasProps {
    images: ImageMetadata[];
    query?: string;
}

export function ImageCanvas({ images, query }: ImageCanvasProps) {
    if (images.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20">
                <div className="text-center p-8">
                    <p className="text-muted-foreground text-lg">
                        Ask me to show you some photos!
                    </p>
                    <p className="text-muted-foreground/60 text-sm mt-2">
                        Try: "Show me wedding photos" or "Display Vinny images"
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="p-4">
                {query && (
                    <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            Showing {images.length} result{images.length !== 1 ? 's' : ''} for:{' '}
                            <span className="font-semibold text-foreground">{query}</span>
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {images.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05,
                                }}
                                className="relative group overflow-hidden rounded-lg bg-muted aspect-square"
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <p className="font-semibold text-sm truncate">
                                            {image.title}
                                        </p>
                                        {image.description && (
                                            <p className="text-xs text-white/80 truncate">
                                                {image.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-white/60 mt-1">
                                            {image.category}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
