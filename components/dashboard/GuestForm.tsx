"use client";

import * as React from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import type { Guest, GuestRole } from "@/types";

interface GuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initial?: Guest;
}

const ROLE_OPTIONS: { value: GuestRole; label: string }[] = [
  { value: "guest", label: "Guest" },
  { value: "entourage", label: "Entourage" },
  { value: "secondary_sponsor", label: "Secondary Sponsor" },
  { value: "principal_sponsor", label: "Principal Sponsor" },
];

export function GuestForm({ isOpen, onClose, mode, initial }: GuestFormProps) {
  const [firstName, setFirstName] = React.useState(initial?.firstName ?? "");
  const [lastName, setLastName] = React.useState(initial?.lastName ?? "");
  const [pax, setPax] = React.useState<string>(String(initial?.pax ?? 1));
  const [role, setRole] = React.useState<GuestRole>(initial?.role ?? "guest");

  React.useEffect(() => {
    if (isOpen) {
      setFirstName(initial?.firstName ?? "");
      setLastName(initial?.lastName ?? "");
      setPax(String(initial?.pax ?? 1));
      setRole(initial?.role ?? "guest");
    }
  }, [isOpen, initial]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add Guest" : "Edit Guest"}
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
            fullWidth
          >
            {mode === "add" ? "Add Guest" : "Save Changes"}
          </Button>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="First Name" required htmlFor="firstName">
            <Input
              id="firstName"
              value={firstName}
              onChange={setFirstName}
              placeholder="e.g. Maria"
            />
          </FormField>
          <FormField label="Last Name" required htmlFor="lastName">
            <Input
              id="lastName"
              value={lastName}
              onChange={setLastName}
              placeholder="e.g. Santos"
            />
          </FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Seats (pax)" required htmlFor="seats">
            <Input
              id="seats"
              type="number"
              inputMode="numeric"
              min={1}
              value={pax}
              onChange={setPax}
            />
          </FormField>
          <FormField label="Role" required htmlFor="role">
            <Select
              id="role"
              options={ROLE_OPTIONS}
              value={role}
              onChange={(v) => setRole(v as GuestRole)}
            />
          </FormField>
        </div>
        <p className="text-xs text-warm-grey italic">
          Static — saving will be enabled in a later phase.
        </p>
      </form>
    </Modal>
  );
}
