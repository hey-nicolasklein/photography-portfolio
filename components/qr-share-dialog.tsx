"use client";

import { useEffect, useMemo, useState } from "react";
// import QRCode from "react-qr-code";
import StyledQrCode from "@/components/styled-qr-code";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Share2, ArrowRight, Instagram } from "lucide-react";
import Link from "next/link";
import ProfileBubble from "@/components/profile-bubble";
import { useToast } from "@/hooks/use-toast";
import type { BioItem } from "@/types";

export interface QrShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url?: string;
  bio?: BioItem | null;
}

export default function QrShareDialog({ open, onOpenChange, url, bio }: QrShareDialogProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string>(url || "");
  const { toast } = useToast();

  useEffect(() => {
    const siteOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL ?? "https://nicolasklein.photography";

    setResolvedUrl(url ?? siteOrigin);
  }, [url]);

  const canWebShare = useMemo(() => typeof navigator !== "undefined" && !!(navigator as any).share, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      toast({ title: "Link kopiert" });
    } catch {}
  }

  async function handleSystemShare() {
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({
          title: "Nicolas Klein Photography",
          text: "Fotografie Portfolio",
          url: resolvedUrl,
        });
      }
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] max-w-md p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="sr-only">Website teilen</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-7 sm:gap-8 py-2">
          {bio?.profileImage && (
            <ProfileBubble
              imageUrl={bio.profileImage}
              alt={bio.profileImageAlt || "Profilbild"}
              message="Danke fürs Teilen! 🎉 QR öffnet direkt – unten Link kopieren oder teilen."
            />
          )}

          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="w-[64vw] max-w-[320px] min-w-[180px] aspect-square">
              <StyledQrCode value={resolvedUrl} />
            </div>
          </div>

          

          <div className="flex w-full flex-wrap items-center justify-center gap-2">
            {!canWebShare && (
              <Button variant="outline" onClick={handleCopy} className="flex-1 min-w-[160px] group">
                <span className="inline-flex items-center">
                  <LinkIcon className="mr-2 h-4 w-4" /> Link kopieren
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            )}
            <Button asChild variant="outline" className="flex-1 min-w-[160px] group">
              <Link
                href="https://www.instagram.com/hey.nicolasklein/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram öffnen"
              >
                <span className="inline-flex items-center">
                  <Instagram className="mr-2 h-4 w-4" /> Instagram öffnen
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
            {canWebShare && (
              <Button onClick={handleSystemShare} className="flex-1 min-w-[160px] group">
                <span className="inline-flex items-center">
                  <Share2 className="mr-2 h-4 w-4" /> Teilen
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
