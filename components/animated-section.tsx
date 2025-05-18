"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  animation?: "fade" | "slide-up" | "slide-left" | "slide-right" | "scale"
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  animation = "fade",
}: AnimatedSectionProps) {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 })

  const animations = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6, delay } },
    },
    "slide-up": {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
    },
    "slide-left": {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay } },
    },
    "slide-right": {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay } },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay } },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={animations[animation]}
      className={className}
    >
      {children}
    </motion.div>
  )
}
