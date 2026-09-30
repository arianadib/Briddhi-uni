"use client";

import { useId, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { springs } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type Segment<T extends string> = { value: T; label: string; lang?: string };

/**
 * A small set of mutually exclusive options. Behaves as a radio group:
 * arrow keys move the selection, and the thumb slides with the `snappy` spring.
 */
export function SegmentedControl<T extends string>({
  label,
  segments,
  value,
  onChange,
  className,
}: {
  label: string;
  segments: Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  const groupId = useId();

  function onKeyDown(event: KeyboardEvent) {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const index = segments.findIndex((s) => s.value === value);
    const next = segments[(index + step + segments.length) % segments.length];
    onChange(next.value);
    document.getElementById(`${groupId}-${next.value}`)?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("rounded-control bg-surface inline-flex p-1", className)}
    >
      {segments.map((segment) => {
        const selected = segment.value === value;
        return (
          <button
            key={segment.value}
            id={`${groupId}-${segment.value}`}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            lang={segment.lang}
            onClick={() => onChange(segment.value)}
            className={cn(
              "relative min-h-9 min-w-11 flex-1 rounded-[9px] px-3 text-[14px] font-medium",
              "transition-colors duration-150",
              selected ? "text-text-1" : "text-text-2",
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${groupId}-thumb`}
                transition={springs.snappy}
                className="bg-bg absolute inset-0 rounded-[9px] shadow-[0_1px_3px_rgb(0_0_0/0.12)]"
              />
            )}
            <span className="relative">{segment.label}</span>
          </button>
        );
      })}
    </div>
  );
}
