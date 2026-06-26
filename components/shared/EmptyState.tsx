"use client";

import * as React from "react";
import { Button } from "./Button";

interface EmptyStateProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ message, action, className = "" }: EmptyStateProps) {
  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center py-10 px-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-warm-grey text-sm mb-4 max-w-xs">{message}</p>
      {action ? (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
