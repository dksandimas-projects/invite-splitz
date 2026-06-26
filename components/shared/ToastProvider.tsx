"use client";

import * as React from "react";

type ToastVariant = "success" | "error" | "neutral";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (opts: { message: string; variant?: ToastVariant; duration?: number }) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const idRef = React.useRef(0);

  const showToast = React.useCallback<ToastContextValue["showToast"]>(
    ({ message, variant = "neutral", duration = 3000 }) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    []
  );

  const value = React.useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastList toasts={toasts} />
    </ToastContext.Provider>
  );
}

const variantBorderClass: Record<ToastVariant, string> = {
  success: "border-l-4 border-garden",
  error: "border-l-4 border-error",
  neutral: "border-l-4 border-stone",
};

function ToastList({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end sm:px-0"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "bg-white shadow-lg rounded-md px-4 py-3 text-sm max-w-sm w-full sm:w-auto",
            variantBorderClass[t.variant],
            "animate-[slideIn_0.2s_ease-out]",
          ].join(" ")}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
