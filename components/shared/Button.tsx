"use client";

import * as React from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "ghost" | "decline" | "danger";
type Size = "sm" | "md";

interface ButtonProps {
  variant: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  form?: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-sunflower text-charcoal hover:bg-sunflower-hover border border-transparent",
  ghost:
    "bg-transparent text-forest border border-garden hover:border-forest",
  decline:
    "bg-transparent text-warm-grey border border-stone hover:border-warm-grey",
  danger: "bg-error text-white border border-transparent",
};

const sizeClass: Record<Size, string> = {
  md: "px-6 py-3 text-sm min-h-[48px]",
  sm: "px-4 py-2 text-xs min-h-[36px]",
};

export function Button({
  variant,
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  form,
  children,
  className = "",
  ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      form={form}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full tracking-wide font-medium transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClass[variant],
        sizeClass[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? <Spinner size="sm" /> : null}
      <span>{children}</span>
    </button>
  );
}
