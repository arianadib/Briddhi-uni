import { z } from "zod";
import { quizRules } from "./rules";

/**
 * A quiz bank: the pause points and questions for one video. This is also the
 * JSON import/export format, so banks can be drafted outside the app and
 * bulk-uploaded as drafts (documented in the README).
 */
const bilingual = z.object({ bn: z.string(), en: z.string() });

export const questionSchema = z.object({
  tier: z.enum(["free", "pro"]),
  conceptTag: z.string(),
  promptBn: z.string(),
  promptEn: z.string(),
  options: z.array(bilingual).min(2).max(4),
  correctIndex: z.number().int().min(0),
  explanationBn: z.string(),
  explanationEn: z.string(),
});

export const pausePointSchema = z.object({
  id: z.string().min(1),
  atSeconds: z.number().nonnegative(),
  question: questionSchema,
});

export const quizBankSchema = z.object({
  videoId: z.string().min(1),
  status: z.enum(["draft", "in_review", "approved", "published"]),
  isSample: z.boolean().default(false),
  sampleNote: z.string().optional(),
  pausePoints: z.array(pausePointSchema),
});

export type Question = z.infer<typeof questionSchema>;
export type PausePoint = z.infer<typeof pausePointSchema>;
export type QuizBank = z.infer<typeof quizBankSchema>;

export type Issue = { level: "error" | "warning"; pausePointId?: string; message: string };

/**
 * Checks a bank against the authoring rules. Errors block review and
 * approval; warnings are shown but don't block.
 */
export function validateBank(bank: QuizBank, videoDurationSeconds: number | null): Issue[] {
  const issues: Issue[] = [];
  const points = [...bank.pausePoints].sort((a, b) => a.atSeconds - b.atSeconds);

  const free = points.filter((p) => p.question.tier === "free").length;
  if (free !== quizRules.freeQuestionsPerVideo) {
    issues.push({
      level: "error",
      message: `A video needs exactly ${quizRules.freeQuestionsPerVideo} free question; this one has ${free}.`,
    });
  }

  if (points.length < quizRules.warnBelow || points.length > quizRules.warnAbove) {
    issues.push({
      level: "warning",
      message: `${points.length} questions. Aim for ${quizRules.warnBelow}–${quizRules.warnAbove} (around ${quizRules.targetQuestions}).`,
    });
  }

  points.forEach((point, i) => {
    const q = point.question;
    const id = point.id;
    if (point.atSeconds < quizRules.minFirstPauseSeconds) {
      issues.push({
        level: "error",
        pausePointId: id,
        message: `Pause point at ${point.atSeconds}s is in the first ${quizRules.minFirstPauseSeconds} seconds. Move it later.`,
      });
    }
    if (videoDurationSeconds !== null && point.atSeconds >= videoDurationSeconds) {
      issues.push({
        level: "error",
        pausePointId: id,
        message: `Pause point at ${point.atSeconds}s is past the end of the video (${videoDurationSeconds}s).`,
      });
    }
    const previous = points[i - 1];
    if (previous && point.atSeconds - previous.atSeconds < quizRules.minGapSeconds) {
      issues.push({
        level: "error",
        pausePointId: id,
        message: `Pause points at ${previous.atSeconds}s and ${point.atSeconds}s are less than ${quizRules.minGapSeconds}s apart.`,
      });
    }
    if (q.correctIndex >= q.options.length) {
      issues.push({
        level: "error",
        pausePointId: id,
        message: "The correct answer points to an option that doesn't exist.",
      });
    }
    const missing = [
      !q.promptBn.trim() && "Bangla prompt",
      !q.promptEn.trim() && "English prompt",
      !q.explanationBn.trim() && "Bangla explanation",
      !q.explanationEn.trim() && "English explanation",
      !q.conceptTag.trim() && "concept tag",
      q.options.some((o) => !o.bn.trim()) && "a Bangla option",
      q.options.some((o) => !o.en.trim()) && "an English option",
    ].filter(Boolean);
    if (missing.length > 0) {
      issues.push({ level: "error", pausePointId: id, message: `Missing ${missing.join(", ")}.` });
    }
  });

  return issues;
}
