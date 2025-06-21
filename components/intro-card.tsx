"use client";

import { motion } from "framer-motion";
import { Camera, MapPin } from "lucide-react";
import Image from "next/image";
import type { BioItem } from "@/types";

interface IntroCardProps {
    bio: BioItem | null;
}

export default function IntroCard({ bio }: IntroCardProps) {
    return (
        <motion.div
            className="mb-2 break-inside-avoid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.4,
                ease: "easeOut"
            }}
        >
            <div className="bg-white border-2 border-black text-black h-full flex flex-col">
                {/* Profile Image Section - Responsive Height */}
                <div className="relative overflow-hidden h-96 sm:h-[500px]">
                    <Image
                        src={bio?.profileImage || "/photographer.png"}
                        alt={bio?.profileImageAlt || "Nicolas Klein - Photographer"}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 500px) 100vw, (max-width: 700px) 50vw, 33vw"
                        priority
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    
                    {/* Name overlay on image */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center text-white">
                            <Camera size={24} className="mr-3 drop-shadow-lg" />
                            <h3 className="text-2xl font-bold uppercase tracking-wider drop-shadow-lg">
                                Nicolas Klein
                            </h3>
                        </div>
                    </div>
                </div>
                
                {/* Content Section - Compact */}
                <div className="p-6 flex-shrink-0">
                    <div className="mb-4">
                        <p className="text-sm font-medium uppercase tracking-wider mb-3 text-gray-700">
                            {bio?.title || "Freiberuflicher Fotograf"}
                        </p>
                        
                        <p className="text-sm leading-relaxed mb-4">
                            {bio?.description || 
                                "Ich halte Momente fest, die Geschichten erzählen – mit einem minimalistischen Blick. Spezialisiert auf Porträts, Events und kommerzielle Fotografie."
                            }
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            Saarbrücken
                        </div>
                        
                        <div className="uppercase tracking-wider">
                            {bio?.tags || "Porträts • Events • Commercial"}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 