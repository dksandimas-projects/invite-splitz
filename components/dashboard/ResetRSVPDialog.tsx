"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface ResetRSVPDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  firstName: string;
  loading?: boolean;
}

export function ResetRSVPDialog({
  isOpen,
  onClose,
  onConfirm,
  firstName,
  loading = false,
}: ResetRSVPDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Reset RSVP?"
      message={`This will clear ${firstName}'s RSVP response. They will be able to submit again.`}
      confirmLabel="Reset"
      confirmVariant="primary"
      cancelLabel="Cancel"
      loading={loading}
    />
  );
}
