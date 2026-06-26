"use client";

import * as React from "react";

type Size = "sm" | "md" | "lg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: Size;
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
}

const sizeClass: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
  footer,
  hideCloseButton = false,
}: ModalProps) {
  // Escape key to close
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  React.useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={[
          "relative w-full bg-white shadow-xl",
          "sm:rounded-lg sm:my-8",
          "rounded-t-[2rem]",
          "max-h-[90vh] overflow-y-auto",
          sizeClass[size],
        ].join(" ")}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <span className="block w-10 h-1 bg-stone rounded-full" />
        </div>

        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-2 sm:pt-6 sm:pb-2">
            {title ? (
              <h2 className="font-serif text-2xl text-charcoal pr-4">
                {title}
              </h2>
            ) : (
              <span />
            )}
            {!hideCloseButton && (
              <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] -mr-2 -mt-2 flex items-center justify-center text-warm-grey hover:text-charcoal rounded-full"
              >
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 sm:py-2">{children}</div>

        {/* Footer */}
        {footer ? (
          <div className="px-6 py-4 bg-stone-light/40 sm:rounded-b-lg flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
