"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface BrandLogoProps {
  className?: string;
  variant?: "light" | "dark";
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  variant = "light",
  showTagline = false,
}) => {
  return (
    <div className={cn("flex flex-col items-center sm:items-start group", className)}>
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[var(--header-border)] shadow-[0_2px_12px_rgba(255,182,193,0.25)] transition-all duration-300 group-hover:shadow-[0_4px_20px_rgba(255,182,193,0.4)]">
        <Image
          src="/logo_new.jpg"
          alt="Aiel Enterprises Logo"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {showTagline && (
        <div className="text-[9px] text-slate-400 font-medium italic mt-1.5 ml-1">
          Play & Innovate
        </div>
      )}
    </div>
  );
};

