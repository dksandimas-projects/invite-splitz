"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  guestName: string;
  loading?: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  guestName,
  loading = false,
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Guest?"
      message={`This will permanently remove ${guestName} and their invite link. This cannot be undone.`}
      confirmLabel="Delete"
      confirmVariant="danger"
      cancelLabel="Cancel"
      loading={loading}
    />
  );
}
