"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClasses =
  "min-h-12 w-full rounded-chip border border-transparent bg-surface px-4 text-[17px] text-text-1 " +
  "placeholder:text-text-3 transition-colors duration-150 " +
  "focus:border-action focus:outline-none aria-invalid:border-incorrect";

/** Label above, hint or error below. Errors say what happened and how to fix it. */
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: (ids: { inputId: string; describedBy?: string }) => ReactNode;
}) {
  const inputId = useId();
  const messageId = `${inputId}-message`;
  const message = error ?? hint;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="type-callout text-text-1">
        {label}
      </label>
      {children({ inputId, describedBy: message ? messageId : undefined })}
      {message && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={cn("type-footnote", error ? "text-incorrect" : "text-text-2")}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  hint,
  error,
  className,
  ...props
}: { label: string; hint?: string; error?: string } & ComponentProps<"input">) {
  return (
    <Field label={label} hint={hint} error={error}>
      {({ inputId, describedBy }) => (
        <input
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className={cn(inputClasses, className)}
          {...props}
        />
      )}
    </Field>
  );
}
