import PortfolioClient from "./portfolio-client";
import { getStories } from "@/lib/strapi";
import { generateMetadata } from "@/lib/og";

export const metadata = generateMetadata({
    title: "Portfolio",
    description: "Entdecke meine Fotografie-Projekte und Geschichten. Portfolio von Nicolas Klein mit verschiedenen Projekten, Porträts, Events und kreativen Arbeiten aus Saarbrücken und Umgebung.",
    path: "/portfolio",
    type: "portfolio",
});

export default async function Portfolio() {
    const stories = await getStories();
    return <PortfolioClient stories={stories} />;
}
