import * as React from "react";
import { Card } from "./Card";

interface SectionCardProps {
  heading: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ heading, children, className = "" }: SectionCardProps) {
  return (
    <Card className={["mb-6", className].filter(Boolean).join(" ")}>
      <h2 className="text-xs uppercase tracking-widest text-warm-grey mb-4">
        {heading}
      </h2>
      {children}
    </Card>
  );
}
