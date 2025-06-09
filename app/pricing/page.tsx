import PricingClient from "./pricing-client";
import { generateMetadata } from "@/lib/og";

export const metadata = generateMetadata({
    title: "Preise",
    description: "Transparente Preise für professionelle Fotografie. Portrait (€100), Event (€200), Follow Around (€300). Maßgeschneiderte Pakete verfügbar.",
    path: "/pricing",
    type: "pricing",
});

export default function Pricing() {
    return <PricingClient />;
}
