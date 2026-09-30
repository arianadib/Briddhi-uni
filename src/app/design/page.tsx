import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignShowcase } from "./DesignShowcase";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

/** Component showcase. Available locally and on preview deploys, never in production. */
export default function DesignPage() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return <DesignShowcase />;
}
