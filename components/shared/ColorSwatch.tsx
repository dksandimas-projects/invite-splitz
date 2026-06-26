interface ColorSwatchProps {
  hex: string;
  name?: string;
  size?: "sm" | "md";
  className?: string;
}

const sizeMap: Record<"sm" | "md", string> = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
};

export function ColorSwatch({
  hex,
  name,
  size = "md",
  className = "",
}: ColorSwatchProps) {
  return (
    <div
      className={[
        "flex flex-col items-center gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={`${sizeMap[size]} rounded-full border border-stone shadow-sm`}
        style={{ backgroundColor: hex }}
        aria-label={name ?? hex}
      />
      {name ? (
        <span className="text-[10px] tracking-[0.15em] uppercase text-warm-grey font-sans">
          {name}
        </span>
      ) : null}
    </div>
  );
}
