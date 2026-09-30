/**
 * A short haptic tick for correct answers and level-ups. Skipped when the
 * browser can't vibrate or the user prefers reduced motion.
 */
export function hapticTick(pattern: number | number[] = 12): void {
  if (typeof window === "undefined" || typeof navigator.vibrate !== "function") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  navigator.vibrate(pattern);
}
