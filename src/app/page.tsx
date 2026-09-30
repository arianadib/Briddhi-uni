import Image from "next/image";
import Link from "next/link";

/** Placeholder until the landing page is built in step 6. */
export default function Home() {
  return (
    <main className="gutter mx-auto flex min-h-dvh max-w-[640px] flex-col justify-center gap-6">
      <Image
        src="/brand/briddhi-logo.png"
        alt="Briddhi"
        width={212}
        height={61}
        priority
        className="h-auto w-[132px] dark:brightness-0 dark:invert"
      />
      <h1 className="type-display text-text-1">Investing, explained simply.</h1>
      <p className="type-body text-text-2">
        Briddhi Uni is being built. The component library is at{" "}
        <Link href="/design" className="text-action font-medium underline underline-offset-4">
          /design
        </Link>
        .
      </p>
    </main>
  );
}
