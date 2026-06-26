"use client";

import * as React from "react";
import { Button } from "./Button";

interface FormFooterProps {
  onSave: () => void;
  onReset: () => void;
  saving?: boolean;
  isDirty?: boolean;
  saveLabel?: string;
  resetLabel?: string;
}

export function FormFooter({
  onSave,
  onReset,
  saving = false,
  isDirty = false,
  saveLabel = "Save Changes",
  resetLabel = "Reset to last saved",
}: FormFooterProps) {
  return (
    <div
      className="md:sticky md:bottom-0 bg-white md:border-t md:border-stone py-4 px-6 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        disabled={!isDirty || saving}
        fullWidth
      >
        {resetLabel}
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={onSave}
        loading={saving}
        fullWidth
      >
        {saveLabel}
      </Button>
    </div>
  );
}
