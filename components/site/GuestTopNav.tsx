interface GuestTopNavProps {
  coupleName: string;
  monogram?: string;
}

export function GuestTopNav({ coupleName, monogram }: GuestTopNavProps) {
  const initials =
    monogram ??
    (coupleName
      .split("&")
      .map((s) => s.trim()[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() ||
      "B&J");

  return (
    <nav
      className="fixed top-0 w-full z-50 bg-offwhite/80 backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex justify-between items-center px-6 max-w-guest mx-auto h-16">
        <span className="font-serif text-section-heading text-primary">
          {initials}
        </span>
        <div className="flex gap-4">
          <a
            href="#rsvp"
            className="text-primary hover:opacity-80 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Jump to RSVP"
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
              aria-hidden
            >
              <path d="M12 2v8" />
              <path d="M5 8a7 7 0 0 0 14 0" />
              <path d="M12 22c4 0 4-4 4-4H8s0 4 4 4z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
