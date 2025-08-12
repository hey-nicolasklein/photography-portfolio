"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import InfiniteImageGrid from "@/components/infinite-image-grid";
import type { GalleryItem, BioItem, Story } from "@/types";
import QrShareGate from "@/components/qr-share-gate";
import { Suspense } from "react";

interface HomeClientProps {
    galleryItems: GalleryItem[];
    bio: BioItem | null;
    stories: Story[];
}

export default function HomeClient({ galleryItems, bio, stories }: HomeClientProps) {
    return (
        <main className="min-h-screen bg-white">
            <Suspense fallback={null}>
                <QrShareGate bio={bio} />
            </Suspense>
            <Header currentPage="home" />
            
            <div className="">
                <InfiniteImageGrid initialImages={galleryItems} bio={bio} stories={stories} />
            </div>
            
            <Footer />
        </main>
    );
} 