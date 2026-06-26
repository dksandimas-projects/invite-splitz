"use client";

import * as React from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";

interface DeleteAllDialogProps {
  isOpen: boolean;
  guestCount: number;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const CONFIRM_PHRASE = "delete all";

export function DeleteAllDialog({
  isOpen,
  guestCount,
  onClose,
  onConfirm,
  loading = false,
}: DeleteAllDialogProps) {
  const [typed, setTyped] = React.useState("");

  // Reset input whenever the dialog opens
  React.useEffect(() => {
    if (isOpen) setTyped("");
  }, [isOpen]);

  const confirmed = typed.trim().toLowerCase() === CONFIRM_PHRASE;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Delete All Guests?"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            loading={loading}
            disabled={!confirmed}
            fullWidth
          >
            Delete All {guestCount} Guests
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-warm-grey leading-relaxed">
          This will permanently remove{" "}
          <span className="font-semibold text-charcoal">
            all {guestCount} guest{guestCount !== 1 ? "s" : ""}
          </span>{" "}
          and their invite links. The entourage list will also be cleared.{" "}
          <span className="font-semibold text-error">This cannot be undone.</span>
        </p>
        <div>
          <label
            htmlFor="delete-all-confirm"
            className="block text-xs uppercase tracking-wide text-warm-grey mb-2"
          >
            Type{" "}
            <span className="font-mono font-semibold text-charcoal">
              {CONFIRM_PHRASE}
            </span>{" "}
            to confirm
          </label>
          <Input
            id="delete-all-confirm"
            value={typed}
            onChange={setTyped}
            placeholder={CONFIRM_PHRASE}
            disabled={loading}
          />
        </div>
      </div>
    </Modal>
  );
}
