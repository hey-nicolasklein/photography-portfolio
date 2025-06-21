"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedButtonProps {
    children: React.ReactNode;
    icon?: LucideIcon;
    onClick?: () => void;
    href?: string;
    className?: string;
}

const buttonVariants = {
    initial: { scale: 1, y: 0 },
    hover: { 
        scale: 1.02, 
        y: -2,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    },
    tap: {
        scale: 0.98,
        y: 0,
        transition: {
            duration: 0.1,
            ease: "easeInOut"
        }
    }
};

const iconVariants = {
    initial: { width: 0, opacity: 0, x: -10 },
    hover: {
        width: 20,
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: "backOut"
        }
    }
};

export default function AnimatedButton({
    children,
    icon: Icon,
    onClick,
    href,
    className = "",
}: AnimatedButtonProps) {
    const buttonContent = (
        <motion.div
            className={`inline-flex items-center justify-center bg-black text-white px-8 py-4 uppercase tracking-wider text-sm font-medium cursor-pointer ${className}`}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
            onClick={onClick}
        >
            <span className="relative">
                {children}
            </span>
            
            {Icon && (
                <motion.div
                    className="ml-2 flex items-center overflow-hidden"
                    variants={iconVariants}
                >
                    <Icon size={16} />
                </motion.div>
            )}
        </motion.div>
    );

    if (href) {
        return (
            <a href={href} className="inline-block">
                {buttonContent}
            </a>
        );
    }

    return buttonContent;
} 