"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useImageColors } from "@/hooks/use-image-colors";

interface ColorPaletteProps {
    imageUrl: string;
    onColorClick?: (color: string) => void;
    visible?: boolean;
}

export default function ColorPalette({
    imageUrl,
    onColorClick,
    visible = true
}: ColorPaletteProps) {
    const { colors, loading } = useImageColors(imageUrl);

    if (!visible || loading || !colors || colors.length === 0) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                className="flex gap-1.5 items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {colors.map((color, index) => (
                    <motion.button
                        key={`${color}-${index}`}
                        className="relative group"
                        onClick={(e) => {
                            e.stopPropagation();
                            onColorClick?.(color);
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        whileHover={{
                            scale: 1.4,
                            y: -4,
                            transition: { duration: 0.2 }
                        }}
                        whileTap={{
                            scale: 1.1,
                            transition: { duration: 0.1 }
                        }}
                        aria-label={`Filter by color ${color}`}
                    >
                        {/* Color chip */}
                        <motion.div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-md cursor-pointer"
                            style={{ backgroundColor: color }}
                            whileHover={{
                                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                            }}
                        />

                        {/* Tooltip on hover */}
                        <motion.div
                            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100"
                            style={{
                                transition: "opacity 0.2s ease-out"
                            }}
                        >
                            {color.toUpperCase()}
                        </motion.div>
                    </motion.button>
                ))}
            </motion.div>
        </AnimatePresence>
    );
}
