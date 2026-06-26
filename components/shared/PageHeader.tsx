import * as React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div
      className={[
        "flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <h1 className="font-serif text-section-heading text-charcoal leading-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-warm-grey">{subtitle}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-col sm:flex-row gap-3">{actions}</div>
      ) : null}
    </div>
  );
}
