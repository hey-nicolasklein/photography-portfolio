import PortfolioClient from "./portfolio-client";
import { getPortfolioItems } from "@/lib/strapi";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portfolio",
    description:
        "Entdecke meine besten Fotografien. Portfolio von Nicolas Klein mit Porträts, Events und kreativen Projekten aus Saarbrücken und Umgebung.",
    openGraph: {
        title: "Portfolio | Nicolas Klein Photography",
        description:
            "Entdecke meine besten Fotografien. Portfolio von Nicolas Klein mit Porträts, Events und kreativen Projekten.",
    },
};

export default async function Portfolio() {
    const portfolioItems = await getPortfolioItems();
    return <PortfolioClient portfolioItems={portfolioItems} />;
}
