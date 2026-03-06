"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface BrandLogoProps {
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  showName?: boolean;
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-12 h-12 sm:w-14 sm:h-14",
  lg: "w-[72px] h-[72px]",
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  variant = "light",
  size = "md",
  showTagline = false,
  showName = false,
}) => {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "flex items-center gap-3 group",
        className
      )}
    >
      {/* Logo Image */}
      <div
        className={cn(
          "relative rounded-full overflow-hidden flex-shrink-0",
          "border-2 border-[#c9a84c]/60",
          "shadow-[0_2px_12px_rgba(201,168,76,0.25)]",
          "transition-all duration-300",
          "group-hover:shadow-[0_4px_20px_rgba(201,168,76,0.4)]",
          "group-hover:border-[#c9a84c]",
          sizeClasses[size]
        )}
      >
        <Image
          src="/aiel-enterprises-logo.jpg"
          alt="Aiel Enterprises Logo"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Brand Name */}
      {showName && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-display font-bold tracking-tight leading-tight",
              size === "sm" ? "text-sm" : "text-base sm:text-lg",
              isDark ? "text-white/90" : "text-[#1a3a4a]"
            )}
          >
            Aiel
          </span>
          <span
            className={cn(
              "font-medium tracking-wider uppercase leading-tight",
              size === "sm" ? "text-[8px]" : "text-[9px] sm:text-[10px]",
              isDark ? "text-[#c9a84c]/80" : "text-[#c9a84c]"
            )}
          >
            Enterprises
          </span>
        </div>
      )}

      {/* Tagline */}
      {showTagline && !showName && (
        <div
          className={cn(
            "text-[9px] font-medium italic",
            isDark ? "text-white/40" : "text-slate-400"
          )}
        >
          Play & Innovate
        </div>
      )}
    </div>
  );
};
