"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { PortfolioItem } from "@/types";

interface PortfolioItemProps {
    item: PortfolioItem;
    onClick: () => void;
}

export default function PortfolioItem({ item, onClick }: PortfolioItemProps) {
    return (
        <motion.div
            className="group relative h-[400px] overflow-hidden cursor-pointer"
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
        >
            <Image
                src={item.image || "/placeholder.svg"}
                alt={item.alt || item.title}
                fill
                className="object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
                    <h3 className="text-white text-lg font-medium">
                        {item.title}
                    </h3>
                    <p className="text-white/80 text-sm">{item.category}</p>
                </div>
            </div>
        </motion.div>
    );
}
