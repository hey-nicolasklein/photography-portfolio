import { Suspense } from "react";
import { getGalleryItems, getPortfolioItems, getBio, getStories } from "@/lib/strapi";
import HomeClient from "./home-client";

const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://nicolasklein.photography",
    name: "Nicolas Klein Photography",
    alternateName: "Nicolas Klein Fotografie",
    description:
        "Professioneller Fotograf in Saarbrücken. Spezialisiert auf Porträts, Events und Follow-Around Fotografie.",
    url: "https://nicolasklein.photography",
    telephone: "+49-176-47694426",
    email: "hello@nicolasklein.photography",
    address: {
        "@type": "PostalAddress",
        streetAddress: "Heinrich-Köhl-Str. 41",
        addressLocality: "Saarbrücken",
        postalCode: "66113",
        addressCountry: "DE",
    },
    geo: {
        "@type": "GeoCoordinates",
        latitude: "49.2401",
        longitude: "6.9969",
    },
    areaServed: {
        "@type": "State",
        name: "Saarland",
    },
    serviceType: [
        "Portrait Fotografie",
        "Event Fotografie",
        "Hochzeitsfotografie",
        "Follow Around Fotografie",
    ],
    priceRange: "€100-€300",
    sameAs: ["https://www.instagram.com/hey.nicolasklein/"],
    founder: {
        "@type": "Person",
        name: "Nicolas Klein",
    },
};

async function getInitialImages() {
    try {
        // Use same logic as API for consistency
        const [galleryItems, portfolioItems] = await Promise.all([
            getGalleryItems(),
            getPortfolioItems()
        ]);

        // Combine items (same as API)
        const allItems = [
            ...galleryItems.map(item => ({
                id: item.id,
                src: item.src,
                alt: item.alt,
                category: item.category || 'gallery'
            })),
            ...portfolioItems.map(item => ({
                id: item.id + 10000,
                src: item.image,
                alt: item.alt || item.title,
                category: item.category || 'portfolio'
            }))
        ];

        // Remove duplicates (same as API)
        const uniqueItems = allItems.filter((item, index, self) => 
            index === self.findIndex(i => i.src === item.src)
        );

        // Simple shuffle (same as API)
        const shuffledItems = [...uniqueItems].sort(() => Math.random() - 0.5);
        
        // Return first 12 items
        return shuffledItems.slice(0, 12);
    } catch (error) {
        console.error('Error fetching initial images:', error);
        return [];
    }
}

export default async function Home() {
    const [galleryItems, bio, stories] = await Promise.all([
        getInitialImages(),
        getBio(),
        getStories()
    ]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            <Suspense fallback={<div className="min-h-screen bg-white" />}>
                <HomeClient galleryItems={galleryItems} bio={bio} stories={stories} />
            </Suspense>
        </>
    );
}
