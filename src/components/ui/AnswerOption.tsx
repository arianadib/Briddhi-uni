"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { springs } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { useT } from "@/lib/preferences/PreferencesProvider";

export type AnswerState = "idle" | "selected" | "correct" | "incorrect" | "dimmed";

/**
 * One answer in a question. Lives inside a role="radiogroup".
 * Correct fills green and draws a check; incorrect fills crimson and nudges once.
 * State is always carried by an icon and text, never colour alone.
 */
export function AnswerOption({
  letter,
  state = "idle",
  onSelect,
  disabled,
  children,
}: {
  letter: string;
  state?: AnswerState;
  onSelect?: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  const t = useT();
  const resolved = state === "correct" || state === "incorrect";

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={state === "selected" || resolved}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onSelect}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      animate={state === "incorrect" ? { x: [0, -4, 4, -2, 0] } : { x: 0 }}
      transition={state === "incorrect" ? { duration: 0.32, ease: "easeOut" } : springs.snappy}
      className={cn(
        "rounded-control flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left",
        "transition-[background-color,box-shadow,color,opacity] duration-200",
        state === "idle" && "bg-bg shadow-[inset_0_0_0_1px_var(--line)]",
        state === "selected" && "bg-bg shadow-[inset_0_0_0_2px_var(--action)]",
        state === "correct" && "bg-correct text-on-correct",
        state === "incorrect" && "bg-incorrect text-on-incorrect",
        state === "dimmed" && "bg-bg opacity-50 shadow-[inset_0_0_0_1px_var(--line)]",
        disabled && !resolved && "cursor-default",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold",
          resolved
            ? "bg-black/15"
            : state === "selected"
              ? "bg-action text-on-action"
              : "bg-surface text-text-2",
        )}
      >
        {state === "correct" ? (
          <DrawnCheck />
        ) : state === "incorrect" ? (
          <X className="size-4" strokeWidth={3} />
        ) : (
          letter
        )}
      </span>
      <span className="type-body flex-1 font-medium">{children}</span>
      {resolved && (
        <span className="sr-only">
          , {t(state === "correct" ? "quiz.optionState.correct" : "quiz.optionState.incorrect")}
        </span>
      )}
    </motion.button>
  );
}

/** A check mark whose stroke draws in over 220ms. */
function DrawnCheck() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3.2}>
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      />
    </svg>
  );
}
