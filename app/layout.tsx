import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ScrollProgress from "@/components/scroll-progress"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Nicolas Klein Photography",
  description: "Professional photography portfolio of Nicolas Klein",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <ScrollProgress />
        {children}
      </body>
    </html>
  )
}
