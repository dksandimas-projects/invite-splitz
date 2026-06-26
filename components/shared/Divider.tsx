interface DividerProps {
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

const spacingClass: Record<"sm" | "md" | "lg", string> = {
  sm: "my-4",
  md: "my-8",
  lg: "my-12",
};

export function Divider({ spacing = "md", className = "" }: DividerProps) {
  return (
    <hr
      className={[
        "border-t border-stone",
        spacingClass[spacing],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
