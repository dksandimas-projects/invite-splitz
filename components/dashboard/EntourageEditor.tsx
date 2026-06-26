"use client";

import * as React from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Textarea } from "@/components/shared/Textarea";
import type { EntourageGroup } from "@/types";

interface EntourageEditorProps {
  value: EntourageGroup[];
  onChange: (next: EntourageGroup[]) => void;
}

export function EntourageEditor({ value, onChange }: EntourageEditorProps) {
  const [confirmingRemove, setConfirmingRemove] = React.useState<number | null>(
    null
  );

  const addGroup = () => {
    onChange([...value, { role: "", members: [] }]);
  };

  const removeGroup = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
    setConfirmingRemove(null);
  };

  const updateGroup = (idx: number, patch: Partial<EntourageGroup>) => {
    onChange(value.map((g, i) => (i === idx ? { ...g, ...patch } : g)));
  };

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <div className="border border-dashed border-stone rounded-md p-6 text-center text-warm-grey text-sm">
          No entourage groups yet.
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((group, idx) => (
            <div
              key={idx}
              className="bg-stone-light/30 rounded-md p-4 space-y-3 relative"
            >
              {confirmingRemove === idx ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-white border border-stone rounded-md p-3">
                  <span className="text-sm text-warm-grey flex-1">
                    Remove this group?
                  </span>
                  <div className="flex gap-2 sm:ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmingRemove(null)}
                    >
                      No
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeGroup(idx)}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingRemove(idx)}
                  aria-label="Remove group"
                  className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-warm-grey hover:text-error"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}

              <Input
                id={`role-${idx}`}
                value={group.role}
                onChange={(v) => updateGroup(idx, { role: v })}
                placeholder="e.g. Principal Sponsors"
              />
              <div>
                <label
                  htmlFor={`members-${idx}`}
                  className="block text-xs uppercase tracking-wide text-warm-grey mb-1"
                >
                  Members (one per line)
                </label>
                <Textarea
                  id={`members-${idx}`}
                  value={group.members.join("\n")}
                  onChange={(v) =>
                    updateGroup(idx, {
                      members: v
                        .split("\n")
                        .map((m) => m.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={4}
                  placeholder={"One name per line\ne.g. Mr. & Mrs. Juan dela Cruz"}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <Button variant="ghost" size="sm" onClick={addGroup} fullWidth>
        + Add Group
      </Button>
    </div>
  );
}
