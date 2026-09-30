"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, House, Library, Trophy, UserRound, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Top bar. Floats: translucent with blur and a hairline, never a shadow.
 * The trailing slot holds the XP counter, which is where earned XP flies to.
 */
export function NavBar({
  back,
  title,
  trailing,
  sticky = true,
}: {
  back?: { href: string; label: string };
  title?: ReactNode;
  trailing?: ReactNode;
  sticky?: boolean;
}) {
  return (
    <header
      className={cn(
        "border-line translucent z-30 border-b",
        sticky && "sticky top-0 pt-[env(safe-area-inset-top)]",
      )}
    >
      <div className="gutter mx-auto flex h-14 max-w-[1120px] items-center gap-2">
        {back ? (
          <Link
            href={back.href}
            className="rounded-control text-action -ml-2 inline-flex min-h-11 items-center gap-0.5 pr-2 active:opacity-70"
          >
            <ChevronLeft aria-hidden className="size-5.5" strokeWidth={2.25} />
            <span className="type-callout">{back.label}</span>
          </Link>
        ) : (
          <span className="type-headline text-text-1">{title}</span>
        )}
        <div className="ml-auto flex items-center gap-3">{trailing}</div>
      </div>
    </header>
  );
}

export type TabItem = {
  href: string;
  label: string;
  icon: "home" | "library" | "rank" | "profile";
};

const tabIcons: Record<TabItem["icon"], LucideIcon> = {
  home: House,
  library: Library,
  rank: Trophy,
  profile: UserRound,
};

/** Bottom tab bar on phones. The current tab is blue, and marked for screen readers. */
export function TabBar({
  items,
  current,
  sticky = true,
}: {
  items: TabItem[];
  current: string;
  sticky?: boolean;
}) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "border-line translucent z-30 border-t",
        sticky && "fixed inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <ul className="mx-auto grid max-w-[640px] grid-cols-4">
        {items.map((item) => {
          const Icon = tabIcons[item.icon];
          const active = item.href === current;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                  "transition-colors duration-150 active:opacity-70",
                  active ? "text-action" : "text-text-3",
                )}
              >
                <Icon aria-hidden className="size-5.5" strokeWidth={active ? 2.25 : 1.75} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
