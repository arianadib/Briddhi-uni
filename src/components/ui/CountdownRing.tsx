"use client";

import { useEffect } from "react";
import { motion } from "motion/react";

/**
 * A thin ring that empties over `seconds`, then calls onDone.
 * Used by the Pro teaser. It's a timer, so it runs linearly, not on a spring.
 */
export function CountdownRing({
  seconds = 3,
  size = 28,
  onDone,
}: {
  seconds?: number;
  size?: number;
  onDone?: () => void;
}) {
  useEffect(() => {
    if (!onDone) return;
    const timer = window.setTimeout(onDone, seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, onDone]);

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 28 28"
      className="text-text-3 -rotate-90"
    >
      <circle cx="14" cy="14" r="12" fill="none" stroke="var(--line)" strokeWidth="2.5" />
      <motion.circle
        cx="14"
        cy="14"
        r="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 1 }}
        animate={{ pathLength: 0 }}
        transition={{ duration: seconds, ease: "linear" }}
      />
    </svg>
  );
}
