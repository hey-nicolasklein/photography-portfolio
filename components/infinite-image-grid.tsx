"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, useTransform, useScroll } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import Masonry from "react-masonry-css";
import { Sun, Camera, Heart } from "lucide-react";
import { useLightbox } from "@/hooks/use-lightbox";
import LightboxPortal from "./lightbox-portal";
import ContactCard from "./contact-card";
import IntroCard from "./intro-card";
import StoriesCard from "./stories-card";
import AnimatedButton from "./animated-button";
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
    
    // Scroll-based rotation
    const { scrollYProgress } = useScroll();
    
    // Slingshot sun animation setup
    const targetX = useMotionValue(0);
    const targetY = useMotionValue(0);
    const mouseDistance = useMotionValue(150); // Distance from sun center - start at max for full black
    const [isInteracting, setIsInteracting] = useState(false);
    
    // Spring physics for slingshot effect - more elastic when interacting
    const springX = useSpring(targetX, { 
        stiffness: isInteracting ? 150 : 400, 
        damping: isInteracting ? 15 : 25, 
        mass: 1.2 
    });
    const springY = useSpring(targetY, { 
        stiffness: isInteracting ? 150 : 400, 
        damping: isInteracting ? 15 : 25, 
        mass: 1.2 
    });
    const springScale = useSpring(isInteracting ? 1.15 : 1, { 
        stiffness: 300, 
        damping: 20, 
        mass: 0.8 
    });
    
    // Smooth spring-based distance for color animation
    const smoothDistance = useSpring(mouseDistance, {
        stiffness: 200,
        damping: 25,
        mass: 0.5
    });
    
    // Scroll-based rotation - full rotation every page scroll
    const scrollRotation = useTransform(scrollYProgress, [0, 1], [0, 2000]);
    
    // Color animation based on smooth mouse proximity with wider range
    // Closer = more yellow, further = more black
    const colorIntensity = useTransform(smoothDistance, [0, 120], [1, 0]);
    const sunColor = useTransform(
        colorIntensity,
        [0, 1],
        ['rgb(234, 179, 8)', 'rgb(0, 0, 0)'] // yellow to black (fixed order)
    );
    
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

    // Function to render grid items with intro, stories, and contact cards inserted
    const renderGridItems = () => {
        const items = [];
        
        // Insert intro card as the very first item (index 0)
        items.push(<IntroCard key="intro-card" bio={bio} />);
        
        // Add first 3-4 images after intro card
        images.slice(0, 4).forEach((image, index) => {
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
        
        // Insert stories card after first 4 images (intro + 4 images)
        if (images.length > 4) {
            items.push(<StoriesCard key="stories-card" stories={stories} />);
        }
        
        // Add next 8 images (5-12)
        images.slice(4, 12).forEach((image, index) => {
            const actualIndex = index + 4;
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
        
        // Insert contact card after more images (intro + 4 images + stories + 8 images)
        if (images.length > 12) {
            items.push(<ContactCard key="contact-card" />);
        }
        
        // Add remaining images
        images.slice(12).forEach((image, index) => {
            const actualIndex = index + 12;
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
                <motion.div 
                    className="text-center py-16"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="flex flex-col items-center space-y-6">
                        {/* Slingshot Interactive Sun Icon */}
                        <motion.div
                            className="cursor-pointer"
                            style={{
                                x: springX,
                                y: springY,
                                scale: springScale,
                                rotate: scrollRotation,
                            }}
                            onMouseEnter={() => {
                                setIsInteracting(true);
                            }}
                            onMouseLeave={() => {
                                setIsInteracting(false);
                                // Snap back to center with bounce
                                targetX.set(0);
                                targetY.set(0);
                                // Reset color to black
                                mouseDistance.set(150);
                            }}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const centerX = rect.left + rect.width / 2;
                                const centerY = rect.top + rect.height / 2;
                                
                                // Calculate pull distance (like a slingshot)
                                const deltaX = e.clientX - centerX;
                                const deltaY = e.clientY - centerY;
                                
                                // Calculate distance from center for color animation
                                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                                mouseDistance.set(Math.min(distance, 150)); // Cap at 150px for wider range
                                
                                if (!isInteracting) return;
                                
                                // Limit the pull distance and make it elastic
                                const maxPull = 25;
                                const pullX = Math.max(-maxPull, Math.min(maxPull, deltaX * 0.4));
                                const pullY = Math.max(-maxPull, Math.min(maxPull, deltaY * 0.4));
                                
                                targetX.set(pullX);
                                targetY.set(pullY);
                            }}
                            onMouseDown={() => {
                                setIsInteracting(true);
                            }}
                            onMouseUp={() => {
                                // Extra bounce back on release
                                targetX.set(0);
                                targetY.set(0);
                            }}
                        >
                            <motion.div
                                style={{ color: sunColor }}
                                className="drop-shadow-lg"
                            >
                                <Sun size={48} />
                            </motion.div>
                        </motion.div>
                        
                        {/* Message */}
                        <motion.div 
                            className="space-y-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <h3 className="text-xl font-bold text-gray-800">
                                Das war's erstmal!
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                                Du hast alle bisherigen Erinnerungen gesehen. 
                                <br />
                                Zeit, gemeinsam neue zu schaffen!
                            </p>
                            
                            {/* Contact Button */}
                            <div className="mt-6">
                                <AnimatedButton 
                                    href="mailto:hello@nicolasklein.photography?subject=Fotografie%20Anfrage%20-%20Neue%20Erinnerungen&body=Hallo%20Nicolas,%0A%0Aich%20habe%20deine%20Galerie%20durchgeschaut%20und%20würde%20gerne%20über%20ein%20Fotoshooting%20sprechen.%0A%0AProjekt-Art:%20%0AEvent-Datum:%20%0ABudget-Bereich:%20%0A%0ABitte%20lass%20mich%20wissen,%20wann%20du%20verfügbar%20bist.%0A%0AViele%20Grüße"
                                    variant="dark"
                                    className="px-8 py-3"
                                >
                                    Erinnerungen schaffen
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
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