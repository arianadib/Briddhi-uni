import "server-only";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { quizBankSchema, type QuizBank } from "./bank";

const DIR = join(process.cwd(), "content", "quiz-banks");

/**
 * Draft sample banks are visible only locally and on preview deploys, so the
 * flow can be tried end to end. In production a learner sees a bank only
 * once a Uni lead has published it.
 */
export function canSeeDraftSamples(): boolean {
  return process.env.VERCEL_ENV !== "production";
}

/**
 * The quiz bank a learner may see for a video, or null.
 * TEMPORARY: reads content/quiz-banks until the database lands with the admin
 * builder (step 7); the rule stays the same.
 */
export async function visibleBankFor(videoId: string): Promise<QuizBank | null> {
  let files: string[];
  try {
    files = await readdir(DIR);
  } catch {
    return null;
  }
  for (const file of files.filter((f) => f.endsWith(".json"))) {
    const bank = quizBankSchema.parse(JSON.parse(await readFile(join(DIR, file), "utf8")));
    if (bank.videoId !== videoId) continue;
    if (bank.status === "published") return bank;
    if (bank.isSample && canSeeDraftSamples()) return bank;
  }
  return null;
}
