"use client";

import * as React from "react";

type InputType = "text" | "email" | "password" | "url" | "date" | "number";

interface InputProps {
  type?: InputType;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  suffix?: React.ReactNode;
  inputMode?:
    | "text"
    | "search"
    | "email"
    | "tel"
    | "url"
    | "none"
    | "numeric"
    | "decimal";
  id?: string;
  className?: string;
  autoComplete?: string;
  onBlur?: () => void;
  min?: number;
}

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  suffix,
  inputMode,
  id,
  className = "",
  autoComplete,
  onBlur,
  min,
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className={`relative w-full ${className}`}>
      <input
        id={id}
        type={resolvedType}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        inputMode={inputMode}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        min={min}
        className={[
          "w-full min-h-[48px] text-base bg-white rounded-md px-3 py-2",
          "border outline-none transition-colors",
          error
            ? "border-red-400 ring-1 ring-red-300"
            : "border-stone focus:border-garden focus:ring-1 focus:ring-garden",
          disabled
            ? "bg-stone-light text-warm-grey cursor-not-allowed"
            : "",
          suffix || isPassword ? "pr-12" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {isPassword ? (
        <button
          type="button"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-warm-grey hover:text-charcoal"
        >
          {showPassword ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      ) : suffix ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-grey">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
