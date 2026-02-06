"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
      "rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      fullWidth && "w-full"
    );

    const variantStyles = {
      primary: cn(
        "bg-primary-400 text-white hover:bg-primary-500 active:bg-primary-600",
        "focus:ring-primary-400 shadow-soft hover:shadow-medium"
      ),
      secondary: cn(
        "bg-secondary-700 text-white hover:bg-secondary-600 active:bg-secondary-800",
        "focus:ring-secondary-500 shadow-soft hover:shadow-medium"
      ),
      outline: cn(
        "border-2 border-surface-400 bg-transparent text-text-primary",
        "hover:bg-surface-200 active:bg-surface-300 focus:ring-primary-400"
      ),
      ghost: cn(
        "bg-transparent text-text-primary hover:bg-surface-200 active:bg-surface-300",
        "focus:ring-primary-400"
      ),
      danger: cn(
        "bg-error text-white hover:bg-red-700 active:bg-red-800",
        "focus:ring-red-500 shadow-soft hover:shadow-medium"
      ),
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
