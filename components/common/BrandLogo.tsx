"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  variant?: "dark" | "light" | "auto";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  href?: string;
  className?: string;
  useImageOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "dark",
  size = "md",
  showTagline = false,
  href = "/",
  className = "",
  useImageOnly = false,
}) => {
  const sizeStyles = {
    sm: { width: 140, height: 42, text: "text-lg", sub: "text-[9px]" },
    md: { width: 180, height: 54, text: "text-2xl", sub: "text-[10px]" },
    lg: { width: 240, height: 72, text: "text-3xl", sub: "text-xs" },
    xl: { width: 300, height: 90, text: "text-4xl", sub: "text-sm" },
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;

  const logoGraphic = useImageOnly ? (
    <img
      src={variant === "light" ? "/images/logo-dark.svg" : "/images/logo.svg"}
      alt="XMORE ART SOLUTIONS"
      style={{ width: `${currentSize.width}px`, height: "auto" }}
      className={`object-contain transition-transform duration-300 group-hover:scale-105 ${className}`}
    />
  ) : (
    <div className={`flex flex-col select-none group ${className}`}>
      <div className="flex items-center">
        <img
          src={variant === "light" ? "/images/logo-dark.svg" : "/images/logo.svg"}
          alt="XMORE ART SOLUTIONS"
          style={{ width: `${currentSize.width}px`, height: "auto" }}
          className="object-contain"
        />
      </div>

      {showTagline && (
        <span className={`font-mono font-bold tracking-widest uppercase mt-1 ${currentSize.sub} ${
          variant === "light" ? "text-neutral-600" : "text-neutral-400"
        }`}>
          Creative Solutions Under One Roof
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none transition-transform">
        {logoGraphic}
      </Link>
    );
  }

  return logoGraphic;
};
