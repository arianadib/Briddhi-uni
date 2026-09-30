import type { Metadata, Viewport } from "next";
import { Anek_Bangla, Inter } from "next/font/google";
import { readPreferences } from "@/lib/preferences/server";
import { Providers } from "./providers";
import "./globals.css";

// Latin: Inter stands in for Neue Haas Grotesk until the licensed files arrive
// (docs/DESIGN.md → Open items). Swap this for next/font/local then.
const latin = Inter({
  variable: "--font-latin",
  subsets: ["latin"],
  display: "swap",
});

// Bangla: one variable file, Bengali glyphs only. Latin runs use the face above.
const bangla = Anek_Bangla({
  variable: "--font-bangla",
  subsets: ["bengali"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Briddhi Uni", template: "%s · Briddhi Uni" },
  description: "Learn investing by watching. Short videos that pause for a question.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, theme } = await readPreferences();
  return (
    <html
      lang={locale}
      data-theme={theme === "system" ? undefined : theme}
      className={`${latin.variable} ${bangla.variable}`}
    >
      <body className="min-h-dvh">
        <Providers locale={locale} theme={theme}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
