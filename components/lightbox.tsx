"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface LightboxProps {
  images: {
    src: string
    alt: string
  }[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export default function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState(0)
  const lightboxRef = useRef<HTMLDivElement>(null)

  // Store original body overflow style
  const bodyOverflowRef = useRef<string>("")

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") navigateImage("prev")
      if (e.key === "ArrowRight") navigateImage("next")
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scrolling when lightbox is open
  useEffect(() => {
    if (isOpen) {
      // Store the original overflow style
      bodyOverflowRef.current = document.body.style.overflow

      // Disable scrolling with multiple approaches for better cross-browser support
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      document.body.style.top = `-${window.scrollY}px`

      // Add a class for additional CSS control
      document.body.classList.add("lightbox-open")
    } else {
      // Restore original scrolling behavior
      const scrollY = document.body.style.top
      document.body.style.overflow = bodyOverflowRef.current
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.top = ""

      // Remove the class
      document.body.classList.remove("lightbox-open")

      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0", 10) * -1)
      }
    }

    return () => {
      // Clean up in case component unmounts while lightbox is open
      document.body.style.overflow = bodyOverflowRef.current
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.top = ""
      document.body.classList.remove("lightbox-open")
    }
  }, [isOpen])

  // Reset current index when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setLoading(true)
    }
  }, [isOpen, initialIndex])

  const navigateImage = useCallback(
    (direction: "next" | "prev") => {
      setLoading(true)
      setDirection(direction === "next" ? 1 : -1)

      if (direction === "next") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      } else {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      }
    },
    [images.length],
  )

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
      // Swipe left
      navigateImage("next")
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right
      navigateImage("prev")
    }
  }

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onClose()
  }

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
      }
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
      }
    },
  }

  if (!isOpen) return null

  return (
    <div className="lightbox-container" ref={lightboxRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={handleCloseClick}
            style={{ touchAction: "none" }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-[10000] p-3 bg-black/70 rounded-full text-white hover:bg-black/90 transition-colors"
              onClick={handleCloseClick}
              aria-label="Close lightbox"
              style={{ touchAction: "manipulation" }}
            >
              <X size={24} />
            </button>

            {/* Navigation - Previous */}
            <button
              className="absolute left-4 z-[10000] p-3 bg-black/70 rounded-full text-white hover:bg-black/90 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                navigateImage("prev")
              }}
              aria-label="Previous image"
              style={{ touchAction: "manipulation" }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Navigation - Next */}
            <button
              className="absolute right-4 z-[10000] p-3 bg-black/70 rounded-full text-white hover:bg-black/90 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                navigateImage("next")
              }}
              aria-label="Next image"
              style={{ touchAction: "manipulation" }}
            >
              <ChevronRight size={24} />
            </button>

            {/* Image container */}
            <div
              className="w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: "none" }}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute w-full h-full flex items-center justify-center p-4"
                >
                  <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                    <Image
                      src={images[currentIndex].src || "/placeholder.svg"}
                      alt={images[currentIndex].alt}
                      fill
                      className={`object-contain transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"}`}
                      sizes="100vw"
                      priority
                      onLoad={() => setLoading(false)}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-white text-sm z-[10000]">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
