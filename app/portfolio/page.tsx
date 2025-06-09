import PortfolioClient from "./portfolio-client";
import { getStories } from "@/lib/strapi";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portfolio",
    description:
        "Entdecke meine Fotografie-Projekte und Geschichten. Portfolio von Nicolas Klein mit verschiedenen Projekten, Porträts, Events und kreativen Arbeiten aus Saarbrücken und Umgebung.",
    openGraph: {
        title: "Portfolio | Nicolas Klein Photography",
        description:
            "Entdecke meine Fotografie-Projekte und Geschichten. Portfolio von Nicolas Klein mit verschiedenen Projekten und kreativen Arbeiten.",
    },
};

export default async function Portfolio() {
    const stories = await getStories();
    return <PortfolioClient stories={stories} />;
}
