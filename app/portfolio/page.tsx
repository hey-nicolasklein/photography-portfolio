import PortfolioClient from "./portfolio-client";

type PortfolioItemType = {
    id: number;
    title: string;
    category: string;
    image: string;
    alt?: string;
};

async function getPortfolioItems(): Promise<PortfolioItemType[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/portfolio-items?populate=FullImage`,
        {
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
            },
            // cache: "force-cache",
        }
    );
    const json = await res.json();

    return (json.data || []).map(
        (item: any): PortfolioItemType => ({
            id: item.id,
            title: item.Title,
            category: item.Description,
            image: item.FullImage.url,
            alt: item.description,
        })
    );
}

export default async function Portfolio() {
    const portfolioItems = await getPortfolioItems();
    return <PortfolioClient portfolioItems={portfolioItems} />;
}
