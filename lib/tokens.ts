export const colors = {
  butter: "#F5F2C0",
  lemon: "#F0E44A",
  sunflower: "#E8C800",
  sunflowerHover: "#D4B400",
  sage: "#B5CC6E",
  garden: "#7BB040",
  forest: "#4E8A20",
  offWhite: "#FAFAF5",
  charcoal: "#2C2B28",
  warmGrey: "#7A7670",
  stone: "#E2DED8",
  stoneLight: "#F0EDE8",
  error: "#EF4444",
} as const;

export const radius = {
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  full: "9999px",
} as const;

export const shadow = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px rgba(0,0,0,0.07)",
  lg: "0 10px 15px rgba(0,0,0,0.10)",
  soft: "0px 4px 20px rgba(44, 43, 40, 0.05)",
} as const;

import { customAlphabet } from "nanoid";

// Lowercase alphanumeric only — 12 chars is the spec length.
// Excludes ambiguous characters (0/O, 1/l/I) for token legibility.
const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
const generateRaw = customAlphabet(ALPHABET, 12);

export function generateToken(): string {
  return generateRaw();
}
