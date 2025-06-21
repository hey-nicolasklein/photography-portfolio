"use client";

import { motion } from "framer-motion";
import { Camera, MapPin } from "lucide-react";
import Image from "next/image";
import AnimatedButton from "./animated-button";
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
            <div className="bg-white text-black h-full flex flex-col relative overflow-hidden">
                {/* Profile Image Section - Portrait Photo Aspect Ratio */}
                <div className="relative aspect-[3/4] sm:aspect-[3/4]">
                    <Image
                        src={bio?.profileImage || "/photographer.png"}
                        alt={bio?.profileImageAlt || "Nicolas Klein - Photographer"}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 500px) 100vw, (max-width: 700px) 50vw, 33vw"
                        priority
                    />
                    {/* Enhanced gradient overlay - more subtle on mobile, stronger on desktop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent sm:from-black/90 sm:via-black/30 sm:to-transparent"></div>
                    
                    {/* Bio content overlay - only bottom third on mobile, more coverage on desktop */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent sm:from-black/60 sm:to-transparent">
                        <div className="mb-2 sm:mb-4">
                            {/* Name with camera icon */}
                            <div className="flex items-center mb-2 sm:mb-3">
                                <Camera size={18} className="mr-2 sm:mr-3 drop-shadow-2xl sm:w-5 sm:h-5" />
                                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider drop-shadow-2xl">
                                    Nicolas Klein
                                </h3>
                            </div>
                            
                            {/* <p className="text-xs sm:text-sm font-medium uppercase tracking-wider mb-2 sm:mb-3 text-white drop-shadow-xl">
                                {bio?.title || "Freiberuflicher Fotograf"}
                            </p> */}
                            
                            {/* Personal introduction on desktop, completely hidden on mobile */}
                            <p className="hidden sm:block text-sm leading-relaxed mb-4 drop-shadow-xl text-white">
                                Hey! Ich bin Nico und fange deine authentischen Momente ein.
                            </p>
                            
                            {/* Call to action button */}
                            <div className="mb-4">
                                <AnimatedButton href="/kontakt" variant="light">
                                    Mehr über mich
                                </AnimatedButton>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between gap-4 sm:gap-6 text-xs text-white drop-shadow-lg">
                            <div className="flex items-center">
                                <MapPin size={12} className="mr-1 sm:w-3.5 sm:h-3.5" />
                                <span className="text-xs sm:text-xs">Saarbrücken</span>
                            </div>
                            
                            <div className="uppercase tracking-wider text-xs sm:text-xs">
                                {bio?.tags || "Porträts • Events • Commercial"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 