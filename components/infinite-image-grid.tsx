"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue, useTransform, useScroll } from "framer-motion";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import Masonry from "react-masonry-css";
import { Sun, Camera, Heart, SearchX } from "lucide-react";
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
    searchQuery?: string;
    onLoadingChange?: (loading: boolean) => void;
}

// Skeleton component for loading states
const ImageSkeleton = ({ index }: { index: number }) => {
    const randomHeight = Math.floor(Math.random() * 200) + 200;
    
    return (
        <motion.div 
            className="w-full mb-2 break-inside-avoid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: "easeOut"
            }}
        >
            <div 
                className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100"
                style={{ height: `${randomHeight}px` }}
            >
                {/* Animated gradient overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: "easeInOut",
                        delay: index * 0.2
                    }}
                />
                
                {/* Camera icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.3 }}
                        animate={{ scale: 1, opacity: 0.6 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                            delay: index * 0.15
                        }}
                    >
                        <Camera size={24} className="text-gray-300" />
                    </motion.div>
                </div>
                
                {/* Subtle grid pattern overlay */}
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '20px 20px'
                    }}
                />
                
                {/* Bottom fade effect */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100/80 to-transparent" />
            </div>
        </motion.div>
    );
};

// Example search terms that we know work well with semantic search
const exampleSearchTerms = [
    "evening",
    "portrait", 
    "celebration",
    "nature",
    "sports",
    "morning",
    "wedding",
    "festival"
];

// Component to display example images when search returns no results
function ExampleImagesDisplay({ searchTerm }: { searchTerm: string }) {
    const [exampleImages, setExampleImages] = useState<GalleryItem[]>([]);
    const [loadingExamples, setLoadingExamples] = useState(true);
    const { lightboxOpen, currentIndex, openLightbox, closeLightbox } = useLightbox();

    useEffect(() => {
        const loadExamples = async () => {
            try {
                const response = await fetch(`/api/search-images?query=${encodeURIComponent(searchTerm)}&page=1&limit=8`);
                const results = await response.json();
                setExampleImages(results);
            } catch (error) {
                console.error('Error loading example images:', error);
                setExampleImages([]);
            } finally {
                setLoadingExamples(false);
            }
        };
        loadExamples();
    }, [searchTerm]);

    if (loadingExamples || exampleImages.length === 0) {
        return null;
    }

    const photos = exampleImages.map((item) => ({
        src: item.src,
        alt: item.alt,
        category: item.category,
    }));

    return (
        <div className="w-full px-2">
            <Masonry
                breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
                className="flex w-auto gap-2"
                columnClassName="bg-clip-padding"
            >
                {exampleImages.map((image, index) => (
                    <motion.div
                        key={image.id}
                        className="mb-2 cursor-pointer group break-inside-avoid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 0.4, 
                            delay: index * 0.05,
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
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        </div>
                    </motion.div>
                ))}
            </Masonry>
            <LightboxPortal
                images={photos}
                initialIndex={currentIndex}
                isOpen={lightboxOpen}
                onClose={closeLightbox}
            />
        </div>
    );
}

export default function InfiniteImageGrid({ initialImages, bio, stories, searchQuery = "", onLoadingChange }: InfiniteImageGridProps) {
    const [images, setImages] = useState<GalleryItem[]>(initialImages);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [exampleSearchTerm, setExampleSearchTerm] = useState<string>("");
    
    // Notify parent of loading state changes
    useEffect(() => {
        onLoadingChange?.(loading);
    }, [loading, onLoadingChange]);
    
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
            const apiEndpoint = searchQuery.trim() 
                ? `/api/search-images?query=${encodeURIComponent(searchQuery.trim())}&page=${page + 1}&limit=12`
                : `/api/portfolio-images?page=${page + 1}&limit=12`;
            
            const response = await fetch(apiEndpoint);
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

    // Reset images and pagination when search query changes
    useEffect(() => {
        const loadSearchResults = async () => {
            if (searchQuery.trim().length === 0) {
                // Show example search results when search is empty
                const randomTerm = exampleSearchTerms[Math.floor(Math.random() * exampleSearchTerms.length)];
                setExampleSearchTerm(randomTerm);
                setIsSearching(true);
                setLoading(true);
                setPage(1);
                setHasMore(true);
                
                try {
                    const response = await fetch(`/api/search-images?query=${encodeURIComponent(randomTerm)}&page=1&limit=12`);
                    const exampleResults = await response.json();
                    
                    // If no results, fallback to initial images
                    if (exampleResults.length === 0) {
                        setImages(initialImages);
                        setHasMore(true);
                    } else {
                        setImages(exampleResults);
                        if (exampleResults.length < 12) {
                            setHasMore(false);
                        } else {
                            setHasMore(true);
                        }
                    }
                } catch (error) {
                    console.error('Error loading example images:', error);
                    // Fallback to initial images on error
                    setImages(initialImages);
                    setHasMore(true);
                } finally {
                    setLoading(false);
                    setIsSearching(false);
                }
                return;
            }

            setIsSearching(true);
            setLoading(true);
            setPage(1);
            setHasMore(true);
            
            try {
                const response = await fetch(`/api/search-images?query=${encodeURIComponent(searchQuery.trim())}&page=1&limit=12`);
                const searchResults = await response.json();
                
                // If no results, show example images as suggestions
                if (searchResults.length === 0) {
                    setImages([]); // Keep empty to show "no results" message
                    
                    // Pick a random example term to show below
                    const randomTerm = exampleSearchTerms[Math.floor(Math.random() * exampleSearchTerms.length)];
                    setExampleSearchTerm(randomTerm);
                    setHasMore(false);
                } else {
                    setImages(searchResults);
                    setExampleSearchTerm(""); // Clear example term when we have real results
                    if (searchResults.length < 12) {
                        setHasMore(false);
                    } else {
                        setHasMore(true);
                    }
                }
            } catch (error) {
                console.error('Error searching images:', error);
                setImages([]);
                setHasMore(false);
            } finally {
                setLoading(false);
                setIsSearching(false);
            }
        };

        loadSearchResults();
    }, [searchQuery, initialImages]);

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
        const hasActiveSearch = searchQuery.trim().length > 0;
        
        // Only show special cards when not actively searching (includes example results)
        if (!hasActiveSearch) {
            // Insert intro card as the very first item (index 0)
            items.push(<IntroCard key="intro-card" bio={bio} />);
        }
        
        // Add first 4 images (after intro card when not searching, from start when searching)
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
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </div>
                </motion.div>
            );
        });
        
        // Insert stories card after first 4 images (only when not actively searching)
        if (!hasActiveSearch && images.length > 4) {
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
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </div>
                </motion.div>
            );
        });
        
        // Insert contact card after more images (only when not actively searching)
        if (!hasActiveSearch && images.length > 12) {
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

            {/* No results message with example images below */}
            {searchQuery.trim().length > 0 && images.length === 0 && !loading && (
                <div className="space-y-12">
                    <motion.div 
                        className="text-center py-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex items-center justify-center gap-3">
                                <SearchX size={24} className="text-gray-800" />
                                <h2 className="text-xl font-medium text-gray-800">
                                    Keine Sucheergebnisse
                                </h2>
                            </div>
                            <p className="text-sm text-gray-600 max-w-md">
                                Versuche es mit anderen Suchbegriffen oder lösche die Suche, um alle Bilder zu sehen.
                            </p>
                        </div>
                    </motion.div>
                    
                    {/* Load and show example images */}
                    {exampleSearchTerm && (
                        <>
                            <div className="w-full px-2 mb-8">
                                <motion.div 
                                    className="text-center mb-8"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                                        <span className="inline-block mr-2">✨</span>
                                        Aber hier sind ein paar andere schöne Bilder
                                        <span className="inline-block ml-2">📸</span>
                                    </h3>
                                </motion.div>
                            </div>
                            <ExampleImagesDisplay searchTerm={exampleSearchTerm} />
                        </>
                    )}
                </div>
            )}

            {/* Intersection observer trigger */}
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                {loading && (
                    <div className="flex items-center gap-2 text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="text-sm">Loading more images...</span>
                    </div>
                )}
            </div>

            {/* End message - only show when not searching */}
            {!hasMore && !loading && searchQuery.trim().length === 0 && (
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