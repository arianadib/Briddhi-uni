"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { springs } from "@/lib/motion";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A bottom sheet: the most important surface in Uni, so it gets the softest
 * corners (28px) and the only shadow. Springs up with `gentle`.
 * When `onDismiss` is given it can be swiped down or closed with Escape.
 * The free question passes no onDismiss, because it can't be skipped.
 */
export function Sheet({
  open,
  onDismiss,
  labelledBy,
  scrim = false,
  contained = false,
  className,
  children,
}: {
  open: boolean;
  onDismiss?: () => void;
  labelledBy?: string;
  /** Darken what's behind. The quiz sheet doesn't; the video dims itself. */
  scrim?: boolean;
  /** Position inside the nearest positioned parent instead of the viewport. */
  contained?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const dismissible = Boolean(onDismiss);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    // Focus the dialog itself so screen readers announce it; Tab then moves inside.
    panel.current?.focus({ preventScroll: true });

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && onDismiss) {
        onDismiss();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      // Keep focus inside the sheet while it's open.
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.({ preventScroll: true });
    };
  }, [open, onDismiss]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 96 || info.velocity.y > 600) onDismiss?.();
  }

  const position = contained ? "absolute" : "fixed";

  return (
    <AnimatePresence>
      {open && (
        <>
          {scrim && (
            <motion.div
              aria-hidden
              className={cn(position, "bg-scrim inset-0 z-40")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onDismiss}
            />
          )}
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            className={cn(
              position,
              "rounded-t-sheet translucent inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[640px]",
              "shadow-lift outline-none",
              "pb-[max(env(safe-area-inset-bottom),20px)]",
              className,
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ ...springs.gentle, delay: 0.06 }}
            drag={dismissible ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={dismissible ? onDragEnd : undefined}
          >
            {dismissible && (
              <div aria-hidden className="flex justify-center pt-2">
                <div className="bg-text-3/40 h-1 w-9 rounded-full" />
              </div>
            )}
            <div className={cn("gutter", dismissible ? "pt-3" : "pt-6")}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
