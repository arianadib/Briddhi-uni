/**
 * Records the hero moment (docs/BUILD_PROMPT.md §12, step 5) as MP4 and GIF.
 *
 *   npm run build && npm run start -- -p 3100
 *   node scripts/record-hero.mjs [--dark] [--en]
 *
 * Needs ffmpeg on PATH. Writes to docs/screenshots/step-5/.
 */
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const LESSON = "/learn/briddhir-kotha/bk-07-treasury-bills-and-bonds";
const DURATION = 1951;
const dark = process.argv.includes("--dark");
const english = process.argv.includes("--en");
const name = `hero-moment-390-${dark ? "dark" : "light"}-${english ? "en" : "bn"}`;
const outDir = join("docs", "screenshots", "step-5");
const rawDir = join(outDir, "raw");
mkdirSync(rawDir, { recursive: true });

const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  colorScheme: dark ? "dark" : "light",
  recordVideo: { dir: rawDir, size: { width: 780, height: 1688 } },
});
if (english) {
  await context.addCookies([{ name: "uni_locale", value: "en", url: BASE }]);
}
// Recordings don't show the pointer, so draw a short ring wherever we tap.
await context.addInitScript(() => {
  window.addEventListener(
    "pointerdown",
    (e) => {
      const dot = document.createElement("div");
      Object.assign(dot.style, {
        position: "fixed",
        left: `${e.clientX - 18}px`,
        top: `${e.clientY - 18}px`,
        width: "36px",
        height: "36px",
        borderRadius: "999px",
        border: "3px solid rgba(22,76,158,0.85)",
        background: "rgba(22,76,158,0.15)",
        zIndex: "9999",
        pointerEvents: "none",
        transition: "opacity 500ms ease, transform 500ms ease",
      });
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.opacity = "0";
        dot.style.transform = "scale(1.6)";
      });
      setTimeout(() => dot.remove(), 600);
    },
    true,
  );
});

const page = await context.newPage();
const wait = (ms) => page.waitForTimeout(ms);
const slider = page.getByRole("slider");
const dialog = page.getByRole("dialog");
const label = (bn, en) => (english ? en : bn);

async function seekTo(seconds) {
  const box = await slider.boundingBox();
  await page.mouse.click(box.x + box.width * (seconds / DURATION), box.y + box.height / 2);
}

await page.goto(BASE + LESSON);
await wait(1200);

// Play, and wait until the video is actually running.
await page.locator("main section button").first().click();
await page.waitForFunction(
  () => Number(document.querySelector('[role="slider"]')?.getAttribute("aria-valuenow")) >= 2,
  undefined,
  { timeout: 30000 },
);
await wait(1500);

// Try to skip far ahead: the free question can't be skipped, so it glides back.
await seekTo(800);
await dialog.waitFor();
await wait(1400);

// Wrong answer first, then the one retry.
await dialog.getByRole("radio").nth(0).click();
await wait(600);
await dialog.getByRole("button", { name: label("উত্তর দিন", "Answer") }).click();
await wait(1800);
await dialog.getByRole("button", { name: label("আবার চেষ্টা করুন", "Try again") }).click();
await wait(500);
await dialog.getByRole("radio").nth(1).click();
await wait(600);
await dialog.getByRole("button", { name: label("উত্তর দিন", "Answer") }).click();
await wait(2600); // check draws, XP flies to the header, counter counts up
await dialog.getByRole("button", { name: label("দেখা চালিয়ে যান", "Continue watching") }).click();
await wait(2000);

// A Pro question: a 3-second teaser, then playback carries on by itself.
await seekTo(416);
await dialog.waitFor({ timeout: 15000 });
await wait(4800);

const video = page.video();
await context.close();
await browser.close();

const webm = await video.path();
const mp4 = join(outDir, `${name}.mp4`);
const gif = join(outDir, `${name}.gif`);
// Trim the first second (blank page), keep the rest.
execFileSync("ffmpeg", [
  "-y",
  "-loglevel",
  "error",
  "-ss",
  "1",
  "-i",
  webm,
  "-vf",
  "scale=780:-2",
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-crf",
  "24",
  "-movflags",
  "+faststart",
  mp4,
]);
execFileSync("ffmpeg", [
  "-y",
  "-loglevel",
  "error",
  "-ss",
  "1",
  "-i",
  webm,
  "-vf",
  "fps=15,scale=360:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4",
  gif,
]);
for (const f of readdirSync(rawDir)) rmSync(join(rawDir, f));
rmSync(rawDir, { recursive: true, force: true });
console.log(`Wrote ${mp4} and ${gif}`);
