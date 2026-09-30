import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { XP, answerXp, streakBonus } from "./xp";
import { levelFor } from "./levels";
import { catalog, isQuizEligible, isShort } from "./catalog";
import { quizBankSchema, validateBank, type QuizBank } from "./quiz/bank";
import { MIN_QUIZ_VIDEO_SECONDS } from "./quiz/rules";

describe("XP", () => {
  it("awards 10 first try, 5 after a retry, 0 when still wrong", () => {
    expect(answerXp(1, true)).toBe(10);
    expect(answerXp(2, true)).toBe(5);
    expect(answerXp(2, false)).toBe(0);
    expect(answerXp(1, false)).toBe(0);
  });
  it("caps the daily streak bonus at 50", () => {
    expect(streakBonus(0)).toBe(0);
    expect(streakBonus(1)).toBe(5);
    expect(streakBonus(7)).toBe(35);
    expect(streakBonus(10)).toBe(50);
    expect(streakBonus(40)).toBe(XP.streakBonusMax);
  });
});

describe("levels", () => {
  it("uses the thresholds from the brief", () => {
    expect(levelFor(0)).toMatchObject({ level: 1, next: 300, progress: 0 });
    expect(levelFor(150).progress).toBeCloseTo(0.5);
    expect(levelFor(300)).toMatchObject({ level: 2, next: 900 });
    expect(levelFor(1999).level).toBe(3);
    expect(levelFor(2000).level).toBe(4);
    expect(levelFor(99999)).toMatchObject({ level: 5, next: null, progress: 1 });
  });
});

describe("catalogue", () => {
  it("parses and has unique video ids", () => {
    const ids = catalog.series.flatMap((s) => s.videos.map((v) => v.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("treats videos under the quiz minimum as shorts", () => {
    expect(MIN_QUIZ_VIDEO_SECONDS).toBe(390);
    const mf101 = catalog.series.find((s) => s.id === "mutual-fund-101")!;
    expect(mf101.videos.every(isShort)).toBe(true);
    const bk = catalog.series.find((s) => s.id === "briddhir-kotha")!;
    expect(bk.videos.filter(isQuizEligible)).toHaveLength(11);
  });
});

describe("quiz banks in content/quiz-banks", () => {
  const dir = join(process.cwd(), "content", "quiz-banks");
  for (const file of readdirSync(dir)) {
    it(`${file} parses and passes validation`, () => {
      const bank = quizBankSchema.parse(JSON.parse(readFileSync(join(dir, file), "utf8")));
      const video = catalog.series.flatMap((s) => s.videos).find((v) => v.id === bank.videoId);
      expect(video, "bank points at a catalogue video").toBeDefined();
      expect(bank.isSample && bank.status === "draft", "samples stay drafts").toBe(true);
      expect(validateBank(bank, video!.durationSeconds)).toEqual([]);
    });
  }
});

describe("validateBank", () => {
  const base: QuizBank = {
    videoId: "x",
    status: "draft",
    isSample: false,
    pausePoints: [],
  };
  const q = (tier: "free" | "pro") => ({
    tier,
    conceptTag: "NAV",
    promptBn: "প্রশ্ন",
    promptEn: "Question",
    options: [
      { bn: "ক", en: "A" },
      { bn: "খ", en: "B" },
    ],
    correctIndex: 0,
    explanationBn: "ব্যাখ্যা",
    explanationEn: "Explanation",
  });

  it("flags timing, free-count and missing-language errors", () => {
    const bank: QuizBank = {
      ...base,
      pausePoints: [
        { id: "a", atSeconds: 10, question: q("free") },
        { id: "b", atSeconds: 40, question: q("free") },
        { id: "c", atSeconds: 200, question: { ...q("pro"), promptBn: " " } },
      ],
    };
    const messages = validateBank(bank, 600).map((i) => `${i.level}:${i.pausePointId ?? "-"}`);
    expect(messages).toContain("error:-"); // two free questions
    expect(messages).toContain("warning:-"); // only 3 questions
    expect(messages).toContain("error:a"); // first 30 seconds
    expect(messages).toContain("error:b"); // under 45s after a
    expect(messages).toContain("error:c"); // missing Bangla prompt
  });
});
