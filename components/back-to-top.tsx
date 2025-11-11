"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when page is scrolled down 400px
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0, y: 100, rotate: -180 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        rotate: 0,
                        transition: {
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            mass: 1
                        }
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0,
                        y: 100,
                        rotate: 180,
                        transition: {
                            duration: 0.3,
                            ease: "easeIn"
                        }
                    }}
                    whileHover={{
                        scale: 1.15,
                        rotate: [0, -10, 10, 0],
                        transition: {
                            scale: {
                                type: "spring",
                                stiffness: 400,
                                damping: 10
                            },
                            rotate: {
                                duration: 0.5,
                                ease: "easeInOut"
                            }
                        }
                    }}
                    whileTap={{
                        scale: 0.9,
                        transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 10
                        }
                    }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                    aria-label="Back to top"
                >
                    <ArrowUp size={24} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
