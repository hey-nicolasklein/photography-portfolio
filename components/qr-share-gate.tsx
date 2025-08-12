"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic, { type DynamicOptions } from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BioItem } from "@/types";

const QrShareDialog = dynamic(() => import("@/components/qr-share-dialog"), {
  ssr: false,
});

interface QrShareGateProps {
  bio: BioItem | null;
}

export default function QrShareGate({ bio }: QrShareGateProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const shouldOpen = useMemo(() => searchParams.get("qr") === "1", [searchParams]);

  useEffect(() => {
    if (shouldOpen) {
      setOpen(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("qr");
      const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      // Replace to clean the URL without scrolling
      router.replace(next, { scroll: false });
    }
  }, [shouldOpen, searchParams, router, pathname]);

  return <QrShareDialog open={open} onOpenChange={setOpen} bio={bio} />;
}
