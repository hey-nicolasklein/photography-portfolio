"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AnimatedButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: "light" | "dark";
    className?: string;
}

export default function AnimatedButton({ 
    href, 
    children, 
    variant = "light",
    className = "" 
}: AnimatedButtonProps) {
    const baseClasses = "relative inline-block px-4 py-2 text-xs sm:text-sm uppercase tracking-wider font-medium overflow-hidden group transition-all duration-300";
    
    const variantClasses = {
        light: "bg-white/20 backdrop-blur-sm text-white border border-white/30 drop-shadow-xl hover:border-white/60 hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]",
        dark: "bg-black/20 backdrop-blur-sm text-black border border-black/30 drop-shadow-xl hover:border-black/60 hover:shadow-[0_0_10px_rgba(0,0,0,0.3)]"
    };

    const shineClasses = {
        light: "bg-gradient-to-r from-transparent via-white/20 to-transparent",
        dark: "bg-gradient-to-r from-transparent via-black/20 to-transparent"
    };

    return (
        <motion.div
            className="inline-block"
            whileHover={{
                scale: 1.05,
                transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    mass: 1.2
                }
            }}
            whileTap={{
                scale: 0.95,
                transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 20
                }
            }}
        >
            <Link
                href={href}
                className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            >
                {/* Animated shine effect */}
                <motion.div
                    className={`absolute inset-0 ${shineClasses[variant]} -translate-x-full`}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{
                        duration: 0.8,
                        ease: "easeInOut"
                    }}
                />
                
                <span className="relative z-10">
                    {children}
                </span>
            </Link>
        </motion.div>
    );
} 