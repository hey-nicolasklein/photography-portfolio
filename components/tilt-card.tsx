"use client";

import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    tiltAmount?: number;
    scaleOnHover?: number;
}

export default function TiltCard({ 
    children, 
    className = "", 
    tiltAmount = 10,
    scaleOnHover = 1.02
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const rotateX = useTransform(y, [-200, 200], [tiltAmount, -tiltAmount]);
    const rotateY = useTransform(x, [-200, 200], [-tiltAmount, tiltAmount]);
    
    const rotateXSpring = useSpring(rotateX, { stiffness: 300, damping: 50 });
    const rotateYSpring = useSpring(rotateY, { stiffness: 300, damping: 50 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            className={`perspective-1000 ${className}`}
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{
                scale: scaleOnHover,
                transition: {
                    duration: 0.3,
                    ease: "easeOut"
                }
            }}
        >
            <motion.div
                style={{
                    rotateX: rotateXSpring,
                    rotateY: rotateYSpring,
                    transformStyle: "preserve-3d",
                }}
                className="relative h-full"
            >
                {children}
            </motion.div>
        </motion.div>
    );
} 