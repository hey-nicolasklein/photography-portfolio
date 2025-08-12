"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

interface ProfileBubbleProps {
  imageUrl: string;
  alt: string;
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function ProfileBubble({ imageUrl, alt, message, size = "md" }: ProfileBubbleProps) {
  const [isInteracting, setIsInteracting] = useState(false);

  // Interactive, bouncy hover similar to the sun interaction (lighter)
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);

  const springX = useSpring(targetX, { stiffness: 200, damping: 15, mass: 0.4 });
  const springY = useSpring(targetY, { stiffness: 200, damping: 15, mass: 0.4 });
  const springScale = useSpring(1, { stiffness: 200, damping: 15, mass: 0.4 });

  const rotate = useTransform([springX, springY], ([x, y]) => (x as number) * 0.2 + (y as number) * 0.05);

  const { containerSizeClass, imageSizePx } = useMemo(() => {
    const sizeToClasses: Record<NonNullable<ProfileBubbleProps["size"]>, string> = {
      sm: "w-20 h-20",
      md: "w-24 h-24",
      lg: "w-32 h-32",
      xl: "w-40 h-40",
    };
    const sizeToPx: Record<NonNullable<ProfileBubbleProps["size"]>, number> = {
      sm: 80,
      md: 96,
      lg: 128,
      xl: 160,
    };
    return {
      containerSizeClass: sizeToClasses[size],
      imageSizePx: sizeToPx[size],
    };
  }, [size]);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`relative ${containerSizeClass} rounded-full overflow-hidden ring-2 transition-shadow duration-300 ${
          isInteracting ? "ring-black/10 shadow-lg" : "ring-black/10 shadow-md"
        } z-10`}
        style={{ x: springX, y: springY, scale: springScale, rotate }}
        onMouseEnter={() => {
          setIsInteracting(true);
          springScale.set(1.05);
        }}
        onMouseLeave={() => {
          setIsInteracting(false);
          targetX.set(0);
          targetY.set(0);
          springScale.set(1);
        }}
        onMouseMove={(e) => {
          if (!isInteracting) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;
          const max = 14;
          targetX.set(Math.max(-max, Math.min(max, deltaX * 0.08)));
          targetY.set(Math.max(-max, Math.min(max, deltaY * 0.08)));
        }}
      >
        <Image src={imageUrl} alt={alt} fill className="object-cover" sizes={`${imageSizePx}px`} priority />
      </motion.div>

      {message ? (
        <div className="relative mt-3 z-0">
          <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-muted" />
          <div className="rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground shadow-sm text-center">
            {message}
          </div>
        </div>
      ) : null}
    </div>
  );
}


