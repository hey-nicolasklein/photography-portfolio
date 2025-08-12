import { redirect } from "next/navigation";
import { generateStaticMetadata } from "@/lib/og";

export const metadata = generateStaticMetadata({
  title: "Teilen",
  description: "Teile nicolasklein.photography schnell per QR‑Code.",
  path: "/share",
  noIndex: true,
});

export default function ShareRedirectPage() {
  redirect("/?qr=1");
}


