"use client";

import * as React from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/shared/Input";
import { Select } from "@/components/shared/Select";
import type { GuestRole } from "@/types";
import type { SerializedGuest } from "@/lib/serialize";

interface GuestFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  initial?: SerializedGuest;
  onSubmit?: (data: {
    firstName: string;
    lastName: string;
    pax: number;
    role: GuestRole;
    subRole: string;
  }) => Promise<void> | void;
  busy?: boolean;
}

const ROLE_OPTIONS: { value: GuestRole; label: string }[] = [
  { value: "Guest", label: "Guest" },
  { value: "Officiant", label: "Officiant" },
  { value: "Entourage", label: "Entourage" },
  { value: "Secondary Sponsor", label: "Secondary Sponsor" },
  { value: "Principal Sponsor", label: "Principal Sponsor" },
];


export function GuestForm({
  isOpen,
  onClose,
  mode,
  initial,
  onSubmit,
  busy = false,
}: GuestFormProps) {
  const [firstName, setFirstName] = React.useState(initial?.firstName ?? "");
  const [lastName, setLastName] = React.useState(initial?.lastName ?? "");
  const [pax, setPax] = React.useState<string>(String(initial?.pax ?? 1));
  const [role, setRole] = React.useState<GuestRole>(initial?.role ?? "Guest");
  const [subRole, setSubRole] = React.useState(initial?.subRole ?? "");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFirstName(initial?.firstName ?? "");
      setLastName(initial?.lastName ?? "");
      setPax(String(initial?.pax ?? 1));
      setRole(initial?.role ?? "Guest");
      setSubRole(initial?.subRole ?? "");
    }
  }, [isOpen, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) {
      onClose();
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        pax: Math.max(1, Number(pax) || 1),
        role,
        subRole: role === "Guest" ? "" : subRole.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled =
    busy ||
    submitting ||
    !firstName.trim() ||
    !lastName.trim() ||
    !pax ||
    Number(pax) < 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add Guest" : "Edit Guest"}
      size="md"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={submitting}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={submitting || busy}
            disabled={isDisabled}
            fullWidth
          >
            {mode === "add" ? "Add Guest" : "Save Changes"}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="First Name" required htmlFor="firstName">
            <Input
              id="firstName"
              value={firstName}
              onChange={setFirstName}
              placeholder="e.g. Maria"
              disabled={submitting}
            />
          </FormField>
          <FormField label="Last Name" required htmlFor="lastName">
            <Input
              id="lastName"
              value={lastName}
              onChange={setLastName}
              placeholder="e.g. Santos"
              disabled={submitting}
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
              disabled={submitting}
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

        {role !== "Guest" ? (
          <FormField label="Sub-Role / Title (optional)" htmlFor="subRole">
            <Input
              id="subRole"
              value={subRole}
              onChange={setSubRole}
              placeholder={
                role === "Principal Sponsor"
                  ? "e.g. Ninong, Ninang"
                  : "e.g. Best Man, Groomsman, Bridesmaid, Maid of Honor"
              }
              disabled={submitting}
            />
          </FormField>
        ) : null}
      </form>
    </Modal>
  );
}
