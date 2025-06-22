"use client";

import AnimatedButton from "./animated-button";

interface ContactActionButtonProps {
    text?: string;
    className?: string;
    variant?: "light" | "dark";
}

export default function ContactActionButton({ 
    text = "Erinnerungen schaffen",
    className = "px-8 py-3",
    variant = "dark"
}: ContactActionButtonProps) {
    const mailtoUrl = "mailto:hello@nicolasklein.photography?subject=Fotografie%20Anfrage%20-%20Neue%20Erinnerungen&body";

    return (
        <AnimatedButton 
            href={mailtoUrl}
            variant={variant}
            className={className}
        >
            {text}
        </AnimatedButton>
    );
} 