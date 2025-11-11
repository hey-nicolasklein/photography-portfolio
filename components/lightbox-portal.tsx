"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface LightboxProps {
  images: {
    src: string
    alt: string
  }[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export default function LightboxPortal({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const isNavigatingRef = useRef(false)

  // Mount check for SSR
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const navigateImage = useCallback(
    (navDirection: "next" | "prev") => {
      // Prevent multiple rapid navigations
      if (isNavigatingRef.current) return
      
      isNavigatingRef.current = true
      setLoading(true)
      setDirection(navDirection === "next" ? "right" : "left")

      if (navDirection === "next") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      } else {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      }

      // Reset navigation lock after animation completes
      setTimeout(() => {
        isNavigatingRef.current = false
      }, 200)
    },
    [images.length],
  )

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        navigateImage("prev")
      } else if (e.key === "ArrowRight") {
        navigateImage("next")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, navigateImage])

  // Reset current index when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setLoading(true)
      setDirection("right")

      // Lock body scroll
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"

      // Hide hamburger menu when lightbox is open
      const hamburgerButton = document.querySelector(".mobile-menu-button") as HTMLElement
      if (hamburgerButton) {
        hamburgerButton.style.display = "none"
      }
    } else {
      // Restore scroll
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""

      // Restore hamburger menu
      const hamburgerButton = document.querySelector(".mobile-menu-button") as HTMLElement
      if (hamburgerButton) {
        hamburgerButton.style.display = ""
      }
    }

    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""

      const hamburgerButton = document.querySelector(".mobile-menu-button") as HTMLElement
      if (hamburgerButton) {
        hamburgerButton.style.display = ""
      }
    }
  }, [isOpen, initialIndex])

  // Reset loading when image index changes
  useEffect(() => {
    setLoading(true)
    // Fallback timeout to ensure loading always resets
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000) // 5 second max loading time

    return () => clearTimeout(timeout)
  }, [currentIndex])

  // Touch swipe handling
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left - go to next
      navigateImage("next")
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right - go to previous
      navigateImage("prev")
    }
  }

  // Handle close with explicit event handling
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  // Handle image click for navigation
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent navigation if already navigating
    if (isNavigatingRef.current) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const middle = width / 2
    const deadZoneWidth = width * 0.2 // 20% dead zone in the middle
    const deadZoneStart = middle - deadZoneWidth / 2
    const deadZoneEnd = middle + deadZoneWidth / 2

    // Ignore clicks in the middle dead zone
    if (clickX >= deadZoneStart && clickX <= deadZoneEnd) {
      return
    }

    // Clear left/right split based on dead zone boundaries
    if (clickX < deadZoneStart) {
      // Left of dead zone - go to previous
      navigateImage("prev")
    } else if (clickX > deadZoneEnd) {
      // Right of dead zone - go to next
      navigateImage("next")
    }
  }

  if (!isMounted) return null

  const slideVariants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? -100 : 100,
      opacity: 0,
    }),
  }

  const transition = {
    x: { type: "tween", duration: 0.15, ease: "easeOut" },
    opacity: { duration: 0.1 },
  }

  // Use createPortal to render outside the normal DOM hierarchy
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
          onClick={handleClose}
          style={{ touchAction: "none" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
      {/* Close button */}
      <motion.button
        className="absolute top-4 right-4 z-[10000] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/20 transition-all"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onClose()
        }}
        aria-label="Close lightbox"
        whileHover={{
          scale: 1.2,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
          }
        }}
        whileTap={{
          scale: 0.85,
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 15
          }
        }}
        initial={{
          opacity: 0,
          scale: 0,
          x: 30,
          y: -30
        }}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            mass: 0.8,
            delay: 0.05
          }
        }}
      >
        <X size={24} />
      </motion.button>

      {/* Navigation - Previous */}
      <motion.button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/20 transition-all"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          navigateImage("prev")
        }}
        aria-label="Previous image"
        whileHover={{
          scale: 1.15,
          x: -8,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
          }
        }}
        whileTap={{
          scale: 0.85,
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 15
          }
        }}
        initial={{
          opacity: 0,
          x: -80,
          scale: 0.5
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            mass: 0.9,
            delay: 0.1
          }
        }}
      >
        <ChevronLeft size={24} />
      </motion.button>

      {/* Navigation - Next */}
      <motion.button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/20 transition-all"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          navigateImage("next")
        }}
        aria-label="Next image"
        whileHover={{
          scale: 1.15,
          x: 8,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 10
          }
        }}
        whileTap={{
          scale: 0.85,
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 15
          }
        }}
        initial={{
          opacity: 0,
          x: 80,
          scale: 0.5
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            mass: 0.9,
            delay: 0.15
          }
        }}
      >
        <ChevronRight size={24} />
      </motion.button>

      {/* Image container */}
      <motion.div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div 
          className="relative w-full h-full max-w-5xl max-h-[80vh] cursor-pointer"
          onClick={handleImageClick}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              className="absolute inset-0 w-full h-full"
            >
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                src={images[currentIndex].src || "/placeholder.svg"}
                alt={images[currentIndex].alt}
                fill
                className={`object-contain transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"} pointer-events-none`}
                sizes="100vw"
                priority
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10000]">
        <motion.div
          className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm border border-white/20"
          key={currentIndex}
          initial={{ opacity: 0, y: 30, scale: 0.6 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.8,
              delay: 0.25
            }
          }}
        >
          {currentIndex + 1} / {images.length}
        </motion.div>
      </div>
    </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
