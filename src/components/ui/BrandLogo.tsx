"use client";

import React from "react";
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
      <div className="relative flex items-end">
        {/* Main Logo Text "AIEL" with Gradient & Stylized Path Effects */}
        <div className="relative">
          <svg
            width="120"
            height="50"
            viewBox="0 0 120 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
          >
            <defs>
              <linearGradient id="aielGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" /> {/* cyan-500 */}
                <stop offset="100%" stopColor="#1e3a8a" /> {/* blue-900 */}
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stylized "A" */}
            <text
              x="5"
              y="40"
              className="font-display font-black text-4xl"
              style={{
                fill: "url(#aielGradient)",
                fontFamily: "var(--font-display), sans-serif",
                letterSpacing: "-0.05em"
              }}
            >
              AIEL
            </text>

            {/* Decorative Elements inspired by user image */}
            {/* Golden Circle Orbit */}
            <circle
              cx="45"
              cy="25"
              r="22"
              stroke="#fbbf24"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              fill="none"
              className="animate-[spin_20s_linear_infinite]"
            />

            {/* Tiny Robots Accents (Simplified Robot Heads) */}
            <g transform="translate(15, 12)">
              <rect width="8" height="6" rx="1" fill="#ef4444" />
              <circle cx="2.5" cy="2.5" r="1" fill="#34d399" />
              <circle cx="5.5" cy="2.5" r="1" fill="#34d399" />
              <path d="M2 1 L2 0 M6 1 L6 0" stroke="#ef4444" strokeWidth="1" />
            </g>
            
            <g transform="translate(65, 10)">
              <rect width="8" height="6" rx="1" fill="#ef4444" />
              <circle cx="2.5" cy="2.5" r="1" fill="#34d399" />
              <circle cx="5.5" cy="2.5" r="1" fill="#34d399" />
              <path d="M2 1 L2 0 M6 1 L6 0" stroke="#ef4444" strokeWidth="1" />
            </g>

            {/* Teddy Bear on "L" area (Simplified) */}
            <g transform="translate(95, 10)">
              <circle cx="4" cy="4" r="3.5" fill="#f59e0b" />
              <circle cx="1.5" cy="1.5" r="1.5" fill="#f59e0b" />
              <circle cx="6.5" cy="1.5" r="1.5" fill="#f59e0b" />
              <circle cx="3" cy="3" r="0.5" fill="black" />
              <circle cx="5" cy="3" r="0.5" fill="black" />
            </g>

            {/* Toy Car at bottom of "L" (Simplified) */}
            <g transform="translate(90, 38)">
              <path d="M0 4 L12 4 L10 0 L2 0 Z" fill="#ef4444" />
              <circle cx="3" cy="4" r="1.5" fill="#1f2937" />
              <circle cx="9" cy="4" r="1.5" fill="#1f2937" />
            </g>
          </svg>
        </div>
      </div>
      
      {/* ENTERPRISES Text */}
      <div 
        className={cn(
          "font-sans text-[10px] sm:text-xs tracking-[0.3em] font-light -mt-1 uppercase transition-colors duration-300",
          variant === "light" ? "text-slate-600 group-hover:text-blue-600" : "text-slate-400 group-hover:text-white"
        )}
      >
        Enterprises
      </div>

      {showTagline && (
        <div className="text-[9px] text-slate-400 font-medium italic mt-0.5">
          Play & Innovate
        </div>
      )}
    </div>
  );
};
