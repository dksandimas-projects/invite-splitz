"use client";

import * as React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  id,
  className = "",
}: SelectProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "w-full min-h-[48px] text-base bg-white rounded-md px-3 py-2 pr-10 appearance-none",
          "border outline-none transition-colors",
          error
            ? "border-red-400 ring-1 ring-red-300"
            : "border-stone focus:border-garden focus:ring-1 focus:ring-garden",
          disabled
            ? "bg-stone-light text-warm-grey cursor-not-allowed"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-garden"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}
