"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import Masonry from "react-masonry-css";
import { useLightbox } from "@/hooks/use-lightbox";
import LightboxPortal from "./lightbox-portal";
import ContactCard from "./contact-card";
import IntroCard from "./intro-card";
import StoriesCard from "./stories-card";
import type { GalleryItem, BioItem, Story } from "@/types";

interface InfiniteImageGridProps {
    initialImages: GalleryItem[];
    bio: BioItem | null;
    stories: Story[];
}

// Skeleton component for loading states
const ImageSkeleton = ({ index }: { index: number }) => (
    <div className="w-full animate-pulse">
        <div 
            className="bg-gray-200 w-full"
            style={{ 
                height: `${Math.floor(Math.random() * 200) + 200}px`,
                animationDelay: `${index * 0.1}s`
            }}
        />
    </div>
);

export default function InfiniteImageGrid({ initialImages, bio, stories }: InfiniteImageGridProps) {
    const [images, setImages] = useState<GalleryItem[]>(initialImages);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    const { lightboxOpen, currentIndex, openLightbox, closeLightbox } = useLightbox();
    
    // Intersection Observer for infinite scroll
    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0.1,
        triggerOnce: false,
    });

    const loadMoreImages = async () => {
        if (loading || !hasMore) return;
        
        setLoading(true);
        try {
            const response = await fetch(`/api/portfolio-images?page=${page + 1}&limit=12`);
            const newImages = await response.json();
            
            if (newImages.length === 0) {
                setHasMore(false);
            } else {
                // Simple duplicate prevention
                const existingIds = new Set(images.map(img => img.id));
                const uniqueNewImages = newImages.filter((img: GalleryItem) => 
                    !existingIds.has(img.id)
                );
                
                if (uniqueNewImages.length > 0) {
                    setImages(prev => [...prev, ...uniqueNewImages]);
                    setPage(prev => prev + 1);
                }
                
                if (newImages.length < 12) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error loading more images:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // Trigger loading when intersection observer fires
    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMoreImages();
        }
    }, [inView, hasMore, loading]);

    // Masonry breakpoints
    const breakpointColumnsObj = {
        default: 3,
        1100: 3,
        700: 2,
        500: 1
    };

    // Convert to lightbox format
    const photos = images.map((item) => ({
        src: item.src,
        alt: item.alt,
        category: item.category,
    }));

    // Function to render grid items with intro, contact, and stories cards inserted
    const renderGridItems = () => {
        const items = [];
        
        // Add first 3 images
        images.slice(0, 3).forEach((image, index) => {
            items.push(
                <motion.div
                    key={image.id}
                    className="mb-2 cursor-pointer group break-inside-avoid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        duration: 0.4, 
                        delay: Math.min(index * 0.05, 0.5),
                        ease: "easeOut"
                    }}
                    onClick={() => openLightbox(index)}
                >
                    <div className="relative overflow-hidden">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={400}
                            height={600}
                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 500px) 100vw, (max-width: 700px) 50vw, 33vw"
                            priority={index < 6}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </div>
                </motion.div>
            );
        });
        
        // Insert intro card after first 3 images
        if (images.length > 3) {
            items.push(<IntroCard key="intro-card" bio={bio} />);
        }
        
        // Add next 6 images (4-9)
        images.slice(3, 9).forEach((image, index) => {
            const actualIndex = index + 3;
            items.push(
                <motion.div
                    key={image.id}
                    className="mb-2 cursor-pointer group break-inside-avoid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        duration: 0.4, 
                        delay: Math.min(actualIndex * 0.05, 0.5),
                        ease: "easeOut"
                    }}
                    onClick={() => openLightbox(actualIndex)}
                >
                    <div className="relative overflow-hidden">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={400}
                            height={600}
                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 500px) 100vw, (max-width: 700px) 50vw, 33vw"
                            priority={actualIndex < 6}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </div>
                </motion.div>
            );
        });
        
        // Insert contact card after first 9 images (3 + intro + 6)
        if (images.length > 9) {
            items.push(<ContactCard key="contact-card" />);
        }
        
        // Add next 6 images (10-15)
        images.slice(9, 15).forEach((image, index) => {
            const actualIndex = index + 9;
            items.push(
                <motion.div
                    key={image.id}
                    className="mb-2 cursor-pointer group break-inside-avoid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        duration: 0.4, 
                        delay: Math.min(actualIndex * 0.05, 0.5),
                        ease: "easeOut"
                    }}
                    onClick={() => openLightbox(actualIndex)}
                >
                    <div className="relative overflow-hidden">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={400}
                            height={600}
                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 500px) 100vw, (max-width: 700px) 50vw, 33vw"
                            priority={actualIndex < 6}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAVGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </div>
                </motion.div>
            );
        });
        
        // Insert stories card after first 15 images (3 + intro + 6 + contact + 6)
        if (images.length > 15) {
            items.push(<StoriesCard key="stories-card" stories={stories} />);
        }
        
        // Add remaining images
        images.slice(15).forEach((image, index) => {
            const actualIndex = index + 15;
            items.push(
                <motion.div
                    key={image.id}
                    className="mb-2 cursor-pointer group break-inside-avoid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        duration: 0.4, 
                        delay: Math.min(actualIndex * 0.05, 0.5),
                        ease: "easeOut"
                    }}
                    onClick={() => openLightbox(actualIndex)}
                >
                    <div className="relative overflow-hidden">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={400}
                            height={600}
                            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 500px) 100vw, (max-width: 700px) 50vw, 33vw"
                            priority={actualIndex < 6}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAVGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </div>
                </motion.div>
            );
        });
        
        return items;
    };

    return (
        <div className="w-full px-2">
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex w-auto gap-2"
                columnClassName="bg-clip-padding"
            >
                {renderGridItems()}
                
                {/* Loading skeletons */}
                {loading && (
                    <>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <ImageSkeleton key={`skeleton-${index}`} index={index} />
                        ))}
                    </>
                )}
            </Masonry>

            {/* Intersection observer trigger */}
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                {loading && (
                    <div className="flex items-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="text-sm">Loading more images...</span>
                    </div>
                )}
            </div>

            {/* End message */}
            {!hasMore && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-sm">
                        You've reached the end of the gallery
                    </p>
                </div>
            )}

            <LightboxPortal
                images={photos}
                initialIndex={currentIndex}
                isOpen={lightboxOpen}
                onClose={closeLightbox}
            />
        </div>
    );
} 