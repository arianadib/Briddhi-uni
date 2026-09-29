import type { Transition } from "motion/react";

/**
 * Named springs from docs/DESIGN.md → Motion. Every animation in Uni uses one of
 * these; nothing animates on its own without a user action behind it.
 */
export const springs = {
  /** Press states, toggles, selection. ~180ms, no overshoot. */
  snappy: { type: "spring", stiffness: 500, damping: 38, mass: 1 },
  /** Sheets, page transitions, video dim and scale. ~380ms, no overshoot. */
  gentle: { type: "spring", stiffness: 260, damping: 32, mass: 1 },
  /** Answer feedback, XP landing, level-up. ~480ms, slight overshoot. */
  bouncy: { type: "spring", stiffness: 420, damping: 20, mass: 0.8 },
} as const satisfies Record<string, Transition>;

/** What every spring becomes when the user prefers reduced motion. */
export const reducedFade: Transition = { duration: 0.12, ease: "easeOut" };
