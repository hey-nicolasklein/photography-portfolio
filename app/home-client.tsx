"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import InfiniteImageGrid from "@/components/infinite-image-grid";
import SearchBar from "@/components/search-bar";
import type { GalleryItem, BioItem, Story } from "@/types";

interface HomeClientProps {
    galleryItems: GalleryItem[];
    bio: BioItem | null;
    stories: Story[];
}

export default function HomeClient({ galleryItems, bio, stories }: HomeClientProps) {
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [resultCount, setResultCount] = useState(0);

    // Initialize search from URL parameter
    useEffect(() => {
        const query = searchParams.get("q");
        if (query) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <main className="min-h-screen bg-white">
            <Header currentPage="home" onLogoClick={() => setSearchQuery("")} />

            <div className="">
                <SearchBar onSearch={handleSearch} isLoading={isSearchLoading} value={searchQuery} />
                {searchQuery.trim().length > 0 && !isSearchLoading && (
                    <div className="text-center py-2 text-sm text-gray-600">
                        {resultCount > 0 ? (
                            <span>Gefunden: {resultCount} {resultCount === 1 ? 'Bild' : 'Bilder'}</span>
                        ) : (
                            <span>Keine Bilder gefunden</span>
                        )}
                    </div>
                )}
                <InfiniteImageGrid
                    initialImages={galleryItems}
                    bio={bio}
                    stories={stories}
                    searchQuery={searchQuery}
                    onLoadingChange={setIsSearchLoading}
                    onResultCountChange={setResultCount}
                />
            </div>

            <Footer />
        </main>
    );
} 