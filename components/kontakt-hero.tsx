"use client";

import ProfileBubble from "@/components/profile-bubble";

interface KontaktHeroProps {
  imageUrl: string;
  alt: string;
  message: string;
  scrollTargetId: string;
}

export default function KontaktHero({ imageUrl, alt, message, scrollTargetId }: KontaktHeroProps) {
  const handleClick = () => {
    const element = document.getElementById(scrollTargetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="flex justify-center">
      <ProfileBubble
        imageUrl={imageUrl}
        alt={alt}
        message={message}
        size="xl"
        onClick={handleClick}
      />
    </div>
  );
}
