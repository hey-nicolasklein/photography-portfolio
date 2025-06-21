import { getGalleryItems, getBio, getStories } from "@/lib/strapi";
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

export default async function Home() {
    const galleryItems = await getGalleryItems();
    const bio = await getBio();
    const stories = await getStories();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            <HomeClient galleryItems={galleryItems} bio={bio} stories={stories} />
        </>
    );
}
