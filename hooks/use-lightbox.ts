"use client"

import { useState } from "react"

export function useLightbox(initialIndex = 0) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  return {
    lightboxOpen,
    currentIndex,
    openLightbox,
    closeLightbox,
  }
}
