"use client";

import ProfileBubble from "@/components/profile-bubble";

interface ScrollableProfileBubbleProps {
  imageUrl: string;
  alt: string;
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
  scrollToId: string;
}

export default function ScrollableProfileBubble({
  imageUrl,
  alt,
  message,
  size = "md",
  scrollToId
}: ScrollableProfileBubbleProps) {
  const handleClick = () => {
    const element = document.getElementById(scrollToId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <ProfileBubble
      imageUrl={imageUrl}
      alt={alt}
      message={message}
      size={size}
      onClick={handleClick}
    />
  );
}
