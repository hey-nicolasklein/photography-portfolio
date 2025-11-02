"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import InfiniteImageGrid from "@/components/infinite-image-grid";
import SearchBar from "@/components/search-bar";
import type { GalleryItem, BioItem, Story } from "@/types";
import QrShareGate from "@/components/qr-share-gate";
import { Suspense } from "react";

interface HomeClientProps {
    galleryItems: GalleryItem[];
    bio: BioItem | null;
    stories: Story[];
}

export default function HomeClient({ galleryItems, bio, stories }: HomeClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <main className="min-h-screen bg-white">
            <Suspense fallback={null}>
                <QrShareGate bio={bio} />
            </Suspense>
            <Header currentPage="home" onLogoClick={() => setSearchQuery("")} />
            
            <div className="">
                <SearchBar onSearch={handleSearch} isLoading={isSearchLoading} value={searchQuery} />
                <InfiniteImageGrid 
                    initialImages={galleryItems} 
                    bio={bio} 
                    stories={stories} 
                    searchQuery={searchQuery}
                    onLoadingChange={setIsSearchLoading}
                />
            </div>
            
            <Footer />
        </main>
    );
} 