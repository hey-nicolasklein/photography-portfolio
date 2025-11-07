"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
    placeholder?: string;
    value?: string;
}

const searchHints = [
    "Abend, Sonnenuntergang, Dämmerung, golden hour...",
    "Portrait, Menschen, Gesichter, Person...",
    "Freude, Feier, Fest, Party, Glück...",
    "Natur, Landschaft, Outdoor, Umwelt...",
    "Sport, Fußball, Bewegung, Athletik...",
    "Morgen, Sonnenaufgang, Morgendämmerung...",
    "Emotionen, Stimmung, Atmosphäre, Gefühle...",
    "Festival, Event, Feier, Party, Fest...",
    "Vinny, Personen, Porträts...",
    "Kunst, Komposition, Ästhetik, Design..."
];

const mobileSearchHints = [
    "Abend, Sonnenuntergang...",
    "Portrait, Menschen..."
];

export default function SearchBar({ 
    onSearch, 
    isLoading = false,
    placeholder,
    value = ""
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [isHintVisible, setIsHintVisible] = useState(true);
    const [isFocused, setIsFocused] = useState(false);
    const isMobile = useIsMobile();
    
    const hints = isMobile ? mobileSearchHints : searchHints;
    
    const { scrollY } = useScroll();
    const opacity = useTransform(
        scrollY,
        [0, 50],
        [1, 0]
    );
    
    // Sync with external value prop
    useEffect(() => {
        if (value === "" && query.length > 0) {
            setQuery("");
            setDebouncedQuery("");
        }
    }, [value]);

    // Debounce search query
    useEffect(() => {
        if (query.length > 0) {
            setIsTyping(true);
        } else {
            // When clearing, delay stopping typing animation for smoother transition
            const typingTimer = setTimeout(() => {
                setIsTyping(false);
            }, 200);
            
            return () => clearTimeout(typingTimer);
        }
        
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            setIsTyping(false);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    // Trigger search when debounced query changes, or immediately clear if input is empty
    useEffect(() => {
        if (query.length === 0) {
            // Clear search immediately when input is empty (don't wait for debounce)
            onSearch("");
        } else {
            // Use debounced query for actual searches
            onSearch(debouncedQuery.trim());
        }
    }, [query, debouncedQuery, onSearch]);

    // Reset hint index when hints array length changes (e.g., on resize)
    useEffect(() => {
        setCurrentHintIndex(0);
    }, [hints.length]);

    // Rotate through search hints
    useEffect(() => {
        if (query.length > 0) {
            setIsHintVisible(false);
            return;
        }
        
        setIsHintVisible(true);
        const interval = setInterval(() => {
            setCurrentHintIndex((prev) => (prev + 1) % hints.length);
        }, 3000); // Change hint every 3 seconds

        return () => clearInterval(interval);
    }, [query, hints.length]);

    const handleClear = () => {
        setQuery("");
        setDebouncedQuery("");
    };

    return (
        <motion.div
            className="w-full px-4 md:px-6 py-6"
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            style={{ opacity }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative w-full">
                <motion.div 
                    className="absolute left-4 flex items-center justify-center h-14 pointer-events-none z-10"
                    animate={{
                        scale: isTyping ? [1, 1.15, 1] : isFocused ? 1.1 : 1,
                        rotate: isTyping ? [0, -12, 12, 0] : isFocused && query.length === 0 ? [0, -5, 5, 0] : 0,
                        x: isTyping ? [0, 2, -2, 0] : 0,
                        color: isFocused || query.length > 0 ? "#000000" : "#9ca3af",
                    }}
                    transition={{
                        duration: isTyping ? 0.3 : 0.5,
                        ease: isTyping ? "easeOut" : "easeInOut",
                        repeat: isTyping ? Infinity : 0,
                        repeatDelay: isTyping ? 0.1 : 0,
                        color: {
                            duration: 0.4,
                            ease: "easeInOut"
                        },
                        scale: {
                            duration: 0.5,
                            ease: "easeOut"
                        },
                        rotate: {
                            duration: 0.5,
                            ease: "easeInOut"
                        }
                    }}
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5" />
                    ) : (
                        <motion.div
                            animate={{
                                rotate: isFocused && !isTyping ? [0, 10, -10, 10, 0] : 0,
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: isFocused && !isTyping && query.length === 0 ? Infinity : 0,
                                repeatDelay: 2
                            }}
                        >
                            <Search className="h-5 w-5" />
                        </motion.div>
                    )}
                </motion.div>
                <div className="relative w-full">
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder || "Suche nach Bildern..."}
                        className="w-full h-14 pl-12 pr-12 text-base md:text-lg text-gray-900 bg-white border border-gray-900 transition-all duration-200 placeholder:text-transparent focus:border-black focus:outline-none focus:ring-0 focus-visible:ring-0 hover:border-gray-900 rounded-none"
                    />
                    <AnimatePresence mode="wait">
                        {isHintVisible && query.length === 0 && (
                            <motion.div
                                key={currentHintIndex}
                                className="absolute left-12 top-0 flex items-center h-14 pointer-events-none text-gray-400 text-base md:text-lg whitespace-nowrap overflow-hidden text-ellipsis pr-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                            >
                                {hints[currentHintIndex]}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black/20 rounded-full p-1"
                        aria-label="Clear search"
                        type="button"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}

