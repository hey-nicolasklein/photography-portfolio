"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

interface StyledQrCodeProps {
  value: string;
  size?: number;
  logoUrl?: string | null;
}

export default function StyledQrCode({ value, size = 320, logoUrl = null }: StyledQrCodeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize only once
    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling({
        width: size,
        height: size,
        type: "svg",
        data: value,
        image: logoUrl ?? undefined,
        imageOptions: {
          imageSize: 0.22,
          margin: 2,
          crossOrigin: "anonymous",
        },
        dotsOptions: {
          type: "rounded",
          color: "#000000",
          gradient: {
            type: "linear",
            rotation: 45,
            colorStops: [
              { offset: 0, color: "#000000" },
              { offset: 1, color: "#4b5563" },
            ],
          },
        },
        cornersSquareOptions: { type: "extra-rounded", color: "#000000" },
        cornersDotOptions: { type: "dot", color: "#111827" },
        backgroundOptions: {
          color: "#ffffff",
        },
      });
      qrRef.current.append(containerRef.current);
    }

    // Update data when value changes
    qrRef.current.update({
      data: value,
      width: size,
      height: size,
      image: logoUrl ?? undefined,
      imageOptions: {
        imageSize: 0.22,
        margin: 2,
        crossOrigin: "anonymous",
      },
    });
  }, [value, size, logoUrl]);

  return <div ref={containerRef} aria-label={`Stilisierter QR‑Code für ${value}`} role="img" />;
}


