"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
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

export default function LightboxPortal({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Mount check for SSR
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const navigateImage = useCallback(
    (direction: "next" | "prev") => {
      setLoading(true)

      if (direction === "next") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      } else {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      }
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

  // Handle close with explicit event handling
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  if (!isMounted || !isOpen) return null

  // Use createPortal to render outside the normal DOM hierarchy
  return createPortal(
    <div
      className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
      onClick={handleClose}
      style={{ touchAction: "none" }}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 z-[10000] p-3 bg-black rounded-full text-white"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onClose()
        }}
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      {/* Navigation - Previous */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-black rounded-full text-white"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          navigateImage("prev")
        }}
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Navigation - Next */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 z-[10000] p-3 bg-black rounded-full text-white"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          navigateImage("next")
        }}
        aria-label="Next image"
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
      </div>

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-white text-sm z-[10000]">
        {currentIndex + 1} / {images.length}
      </div>
    </div>,
    document.body,
  )
}
