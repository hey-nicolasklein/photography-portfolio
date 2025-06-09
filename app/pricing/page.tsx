import PricingClient from "./pricing-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Preise",
    description:
        "Transparente Preise für professionelle Fotografie. Portrait (€100), Event (€200), Follow Around (€300). Maßgeschneiderte Pakete verfügbar.",
    openGraph: {
        title: "Preise | Nicolas Klein Photography",
        description:
            "Transparente Preise für professionelle Fotografie. Portrait, Event und Follow Around Pakete.",
    },
};

export default function Pricing() {
    return <PricingClient />;
}
