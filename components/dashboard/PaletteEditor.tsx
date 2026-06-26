"use client";

import * as React from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import type { ColorSwatch } from "@/types";

interface PaletteEditorProps {
  value: ColorSwatch[];
  onChange: (next: ColorSwatch[]) => void;
  max?: number;
}

const HEX_RE = /^#[0-9A-Fa-f]{6}$/;

export function PaletteEditor({
  value,
  onChange,
  max = 8,
}: PaletteEditorProps) {
  const [hexErrors, setHexErrors] = React.useState<Record<number, string>>({});

  const addRow = () => {
    if (value.length >= max) return;
    onChange([...value, { name: "", hex: "#ffffff" }]);
  };

  const removeRow = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
    setHexErrors((prev) => {
      const next = { ...prev };
      delete next[idx];
      return next;
    });
  };

  const updateRow = (idx: number, patch: Partial<ColorSwatch>) => {
    onChange(value.map((row, i) => (i === idx ? { ...row, ...patch } : row)));
  };

  const validateHex = (idx: number, hex: string) => {
    if (!hex) {
      setHexErrors((prev) => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
      return;
    }
    if (!HEX_RE.test(hex)) {
      setHexErrors((prev) => ({
        ...prev,
        [idx]: "Please enter a valid hex color (e.g. #E8C800)",
      }));
    } else {
      setHexErrors((prev) => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
    }
  };

  return (
    <div className="space-y-3">
      {value.length === 0 ? (
        <div className="border border-dashed border-stone rounded-md p-6 text-center text-warm-grey text-sm">
          No colors yet.
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((row, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center gap-3 bg-stone-light/30 rounded-md p-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-8 h-8 rounded-full border border-stone shadow-sm flex-shrink-0"
                  style={{ backgroundColor: row.hex }}
                />
                <Input
                  id={`hex-${idx}`}
                  value={row.hex}
                  onChange={(v) => {
                    updateRow(idx, { hex: v });
                    validateHex(idx, v);
                  }}
                  onBlur={() => validateHex(idx, row.hex)}
                  className="w-full sm:w-32"
                  error={hexErrors[idx]}
                />
                <Input
                  id={`name-${idx}`}
                  value={row.name}
                  onChange={(v) => updateRow(idx, { name: v.slice(0, 30) })}
                  placeholder="Color name"
                  className="flex-1 min-w-0"
                />
              </div>
              <button
                type="button"
                onClick={() => removeRow(idx)}
                aria-label="Remove color"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-warm-grey hover:text-error self-end sm:self-center"
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
            </div>
          ))}
        </div>
      )}

      {value.length >= max ? (
        <p className="text-xs text-warm-grey text-center py-2">
          Maximum {max} colors reached.
        </p>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={addRow}
          fullWidth
        >
          + Add Color
        </Button>
      )}
    </div>
  );
}
