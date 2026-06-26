"use client";

import * as React from "react";

interface TextareaProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  onBlur?: () => void;
}

export function Textarea({
  placeholder,
  value,
  onChange,
  rows = 4,
  error,
  disabled = false,
  id,
  className = "",
  onBlur,
}: TextareaProps) {
  return (
    <textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={[
        "w-full text-base bg-white rounded-md px-3 py-2 resize-y",
        "border outline-none transition-colors min-h-[48px]",
        error
          ? "border-red-400 ring-1 ring-red-300"
          : "border-stone focus:border-garden focus:ring-1 focus:ring-garden",
        disabled
          ? "bg-stone-light text-warm-grey cursor-not-allowed"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
