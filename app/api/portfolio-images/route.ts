import { NextResponse } from "next/server";

type PortfolioItemType = {
    id: number;
    title: string;
    category: string;
    image: string;
    alt?: string;
};

export async function GET() {
    console.log("[API] Fetching portfolio images from Strapi...");
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?populate=deep`,
        {
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
            cache: "no-store",
        }
    );
    console.log("[API] Strapi response status:", res.status);
    const json = await res.json();
    const items: PortfolioItemType[] = (json.data || []).map((item: any) => ({
        id: item.id,
        title: item.attributes.title,
        category: item.attributes.category,
        image: item.attributes.image?.data?.attributes?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.image.data.attributes.url}`
            : "/placeholder.svg",
        alt: item.attributes.alt || item.attributes.title,
    }));
    console.log(`[API] Returning ${items.length} portfolio items`);
    return NextResponse.json(items);
}
