import * as React from "react";

type Padding = "none" | "sm" | "md" | "lg";

interface CardProps {
  padding?: Padding;
  children: React.ReactNode;
  className?: string;
}

const paddingClass: Record<Padding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ padding = "md", children, className = "" }: CardProps) {
  return (
    <div
      className={[
        "bg-white rounded-lg shadow-soft",
        paddingClass[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
