import * as React from "react";

interface FormFieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  hint,
  error,
  required = false,
  htmlFor,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor={htmlFor}
        className="mb-1 text-xs uppercase tracking-wide text-warm-grey"
      >
        {label}
        {required ? <span className="text-error ml-1">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-warm-grey">{hint}</p>
      ) : null}
    </div>
  );
}
