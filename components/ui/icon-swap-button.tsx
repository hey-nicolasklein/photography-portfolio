"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface IconSwapButtonProps
  extends Omit<ButtonProps, "children"> {
  label: React.ReactNode;
  leadingIcon: React.ReactNode;
  trailingIcon: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

export default function IconSwapButton({
  label,
  leadingIcon,
  trailingIcon,
  href,
  target,
  rel,
  ariaLabel,
  className,
  variant,
  size,
  ...buttonProps
}: IconSwapButtonProps) {
  const leadingVariants = {
    initial: { x: 0, opacity: 1 },
    hover: { x: -12, opacity: 0 },
  };

  const trailingVariants = {
    initial: { x: 12, opacity: 0 },
    hover: { x: 0, opacity: 1 },
  };

  const Content = (
    <span className="inline-flex items-center gap-2">
      <motion.span
        className="inline-flex w-4 justify-center [&_svg]:size-4"
        variants={leadingVariants}
        initial="initial"
        aria-hidden
      >
        {leadingIcon}
      </motion.span>

      <span className="whitespace-nowrap">{label}</span>

      <motion.span
        className="inline-flex w-4 justify-center [&_svg]:size-4"
        variants={trailingVariants}
        initial="initial"
        aria-hidden
      >
        {trailingIcon}
      </motion.span>
    </span>
  );

  return (
    <motion.div whileHover="hover" className="inline-flex">
      {href ? (
        <Button
          asChild
          className={cn(className)}
          variant={variant}
          size={size}
          {...buttonProps}
        >
          <Link href={href} target={target} rel={rel} aria-label={ariaLabel}>
            {Content}
          </Link>
        </Button>
      ) : (
        <Button className={cn(className)} variant={variant} size={size} {...buttonProps}>
          {Content}
        </Button>
      )}
    </motion.div>
  );
}


