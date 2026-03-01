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
      <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2 hover:bg-white/20 transition-all duration-300">
        <Image
          src="/logo_new.jpg"
          alt="Aiel Enterprises Logo"
          width={180}
          height={60}
          className="object-contain"
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

