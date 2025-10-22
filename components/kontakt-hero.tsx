"use client";

import ProfileBubble from "@/components/profile-bubble";

interface KontaktHeroProps {
  imageUrl: string;
  alt: string;
  message: string;
}

export default function KontaktHero({ imageUrl, alt, message }: KontaktHeroProps) {
  const handleClick = () => {
    const element = document.getElementById("kontakt-section");
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
