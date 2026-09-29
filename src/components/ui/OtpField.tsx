"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { toAsciiDigits } from "@/lib/digits";

const LENGTH = 6;

/**
 * Six boxes backed by one real input, so SMS autofill
 * (autocomplete="one-time-code"), paste and Bangla digits all work.
 * Calls onComplete as soon as the sixth digit lands.
 */
export function OtpField({
  label,
  hint,
  error,
  value,
  onChange,
  onComplete,
  disabled,
  autoFocus,
}: {
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (code: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, LENGTH - 1);
  const message = error ?? hint;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-callout text-text-1">
        {label}
      </label>
      <div className="relative" lang="en">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={LENGTH * 2}
          autoFocus={autoFocus}
          disabled={disabled}
          value={value}
          aria-describedby={message ? `${id}-message` : undefined}
          aria-invalid={error ? true : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const code = toAsciiDigits(e.target.value).slice(0, LENGTH);
            onChange(code);
            if (code.length === LENGTH) onComplete?.(code);
          }}
          className="absolute inset-0 z-10 w-full cursor-text bg-transparent text-transparent caret-transparent opacity-0"
        />
        <div aria-hidden className="grid grid-cols-6 gap-2">
          {Array.from({ length: LENGTH }, (_, i) => (
            <div
              key={i}
              className={cn(
                "rounded-control bg-surface flex aspect-[4/5] max-h-16 items-center justify-center",
                "text-text-1 border text-[24px] font-semibold tabular-nums transition-colors duration-150",
                error
                  ? "border-incorrect"
                  : focused && i === active && !disabled
                    ? "border-action"
                    : "border-transparent",
              )}
            >
              {value[i] ?? ""}
            </div>
          ))}
        </div>
      </div>
      {message && (
        <p
          id={`${id}-message`}
          role={error ? "alert" : undefined}
          className={cn("type-footnote", error ? "text-incorrect" : "text-text-2")}
        >
          {message}
        </p>
      )}
    </div>
  );
}
