"use client";

import * as React from "react";

interface ScrollDownGuideProps {
  label?: string;
  isHero?: boolean;
}

export function ScrollDownGuide({
  label = "Scroll Down",
  isHero = false,
}: ScrollDownGuideProps) {
  const handleScroll = (e: React.MouseEvent<HTMLButtonElement>) => {
    const currentSection = e.currentTarget.closest("[data-scroll-section]");
    if (currentSection) {
      const nextSection = currentSection.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className={`flex justify-center ${isHero ? "pb-12 pt-6" : "pb-6 pt-2"}`}>
      <button
        onClick={handleScroll}
        className="group flex flex-col items-center focus:outline-none cursor-pointer w-full max-w-xs sm:max-w-md"
        aria-label={label}
      >
        <span
          className={[
            "uppercase font-semibold transition-colors duration-300 group-hover:text-garden text-center px-4",
            isHero
              ? "text-sm tracking-[0.25em] text-forest"
              : "text-xs tracking-[0.2em] text-forest/80",
          ].join(" ")}
        >
          {label}
        </span>
        <div className="flex flex-col items-center mt-3 gap-1">
          {/* Elegant vertical line */}
          <div
            className={[
              "w-[2px] transition-all duration-500",
              isHero
                ? "h-14 bg-gradient-to-b from-sunflower via-garden to-forest group-hover:h-18"
                : "h-6 bg-forest/30 group-hover:h-9 group-hover:bg-forest/65",
            ].join(" ")}
          />
          {/* Smooth custom bouncing chevron */}
          <svg
            width={isHero ? "22" : "16"}
            height={isHero ? "22" : "16"}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={isHero ? "2.8" : "2.0"}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-forest group-hover:text-garden animate-scroll-indicator transition-colors duration-300"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>
    </div>
  );
}
