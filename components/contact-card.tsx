"use client";

import { motion } from "framer-motion";
import { Mail, Instagram } from "lucide-react";

export default function ContactCard() {
    return (
        <motion.div
            className="mb-2 break-inside-avoid"
            data-contact-card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.4,
                ease: "easeOut"
            }}
        >
            <div className="bg-black text-white p-8 h-full flex flex-col justify-center min-h-[300px]">
                <h3 className="text-xl font-bold uppercase mb-4 tracking-wider">
                    Gefallen dir diese Bilder?
                </h3>
                
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Lass uns über dein nächstes Fotoshooting sprechen. 
                    Porträts, Events oder kommerzielle Projekte – 
                    ich bringe deine Vision zum Leben.
                </p>
                
                <div className="space-y-4">
                    <a
                        href="mailto:hello@nicolasklein.photography?subject=Fotografie%20Anfrage&body=Hallo%20Nicolas,%0A%0Aich%20würde%20gerne%20über%20deine%20Fotografie-Services%20sprechen.%0A%0AProjekt-Art:%20%0AEvent-Datum:%20%0ABudget-Bereich:%20%0A%0ABitte%20lass%20mich%20wissen,%20wann%20du%20verfügbar%20bist.%0A%0AViele%20Grüße"
                        className="inline-flex items-center bg-white text-black px-6 py-3 uppercase tracking-wider text-sm font-medium hover:bg-gray-100 transition-colors duration-300 group"
                    >
                        <Mail size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                        Kontakt aufnehmen
                    </a>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <a
                            href="https://www.instagram.com/hey.nicolasklein/"
                            className="flex items-center hover:text-white transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Instagram size={16} className="mr-2" />
                            @hey.nicolasklein
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 