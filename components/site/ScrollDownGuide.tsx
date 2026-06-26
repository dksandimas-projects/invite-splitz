"use client";

import * as React from "react";

export function ScrollDownGuide() {
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
    <div className="flex justify-center pb-8 pt-2">
      <button
        onClick={handleScroll}
        className="group flex flex-col items-center gap-1.5 focus:outline-none cursor-pointer"
        aria-label="Scroll to next section"
      >
        <span className="text-[9px] tracking-[0.25em] uppercase text-warm-grey opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          Scroll Down
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7A7670"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bounce group-hover:stroke-charcoal transition-colors duration-300"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}
