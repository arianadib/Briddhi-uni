import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "tertiary";
type Size = "lg" | "md";

type StyleProps = {
  /** primary: the one blue action per screen. secondary: hairline. tertiary: text only. */
  variant?: Variant;
  /** lg is 52px tall (primary actions), md is 44px (the minimum tap target). */
  size?: Size;
  fullWidth?: boolean;
};

const base =
  "relative inline-flex select-none items-center justify-center gap-2 rounded-control font-semibold " +
  "transition-[transform,background-color,opacity] duration-150 ease-out " +
  "active:scale-[0.97] disabled:pointer-events-none aria-busy:opacity-80";

// Disabled is a neutral state (surface + text-3), not a faded blue, so it reads
// clearly as "not yet" in both themes. A loading button stays in its colour.
const variants: Record<Variant, string> = {
  primary:
    "bg-action text-on-action active:bg-action-pressed " +
    "disabled:not-aria-busy:bg-surface disabled:not-aria-busy:text-text-3",
  secondary:
    "border border-line bg-bg text-text-1 active:bg-surface disabled:not-aria-busy:text-text-3",
  tertiary: "text-action active:opacity-70 disabled:not-aria-busy:text-text-3",
};

const sizes: Record<Size, string> = {
  lg: "min-h-13 px-6 text-[17px]",
  md: "min-h-11 px-4 text-[15px]",
};

function classes({ variant = "primary", size = "lg", fullWidth }: StyleProps, extra?: string) {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    variant === "tertiary" && "px-2",
    extra,
  );
}

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: StyleProps & ComponentProps<"button"> & { loading?: boolean }) {
  return (
    <button
      type="button"
      className={classes({ variant, size, fullWidth }, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle aria-hidden className="size-5 animate-spin" />}
      {children}
    </button>
  );
}

/**
 * A link styled as a button. `external` opens in a new tab and adds the ↗,
 * the only arrow in the app, because it means "you're leaving Uni".
 */
export function ButtonLink({
  variant,
  size,
  fullWidth,
  external = false,
  className,
  children,
  href,
  ...props
}: StyleProps &
  Omit<ComponentProps<typeof Link>, "href"> & {
    href: string;
    external?: boolean;
    children: ReactNode;
  }) {
  const style = classes({ variant, size, fullWidth }, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={style}>
        {children}
        <ArrowUpRight aria-hidden className="size-4.5" strokeWidth={2.25} />
      </a>
    );
  }
  return (
    <Link href={href} className={style} {...props}>
      {children}
    </Link>
  );
}
