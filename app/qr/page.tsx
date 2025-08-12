import { redirect } from "next/navigation";
import { generateStaticMetadata } from "@/lib/og";

export const metadata = generateStaticMetadata({
  title: "QR teilen",
  description: "Teile nicolasklein.photography schnell per QR‑Code.",
  path: "/qr",
  noIndex: true,
});

export default function QrRedirectPage() {
  redirect("/?qr=1");
}
