"use client";

import { cn } from "@/lib/cn";
import { formatBdNational, toBdNational } from "@/lib/digits";
import { Field, inputClasses } from "./TextField";

/**
 * Bangladeshi mobile number with a fixed +880 prefix. Accepts 01…, +880…
 * and Bangla digits, and keeps only the 10 national digits.
 */
export function PhoneField({
  label,
  hint,
  error,
  value,
  onChange,
  autoFocus,
}: {
  label: string;
  hint?: string;
  error?: string;
  /** The 10 national digits, e.g. "1712345678". */
  value: string;
  onChange: (national: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <Field label={label} hint={hint} error={error}>
      {({ inputId, describedBy }) => (
        <div className="relative">
          <span
            aria-hidden
            className="text-text-2 pointer-events-none absolute inset-y-0 left-4 flex items-center text-[17px]"
            lang="en"
          >
            +880
          </span>
          <input
            id={inputId}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            autoFocus={autoFocus}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            placeholder="1712-345678"
            value={formatBdNational(value)}
            onChange={(e) => onChange(toBdNational(e.target.value))}
            className={cn(inputClasses, "pl-[4.25rem] tracking-[0.02em] tabular-nums")}
            lang="en"
          />
        </div>
      )}
    </Field>
  );
}
