/** XP rules from the brief (docs/BUILD_PROMPT.md §8). XP rewards learning, never trading. */
export const XP = {
  correctFirstTry: 10,
  correctAfterRetry: 5,
  finishVideo: 50,
  streakBonusPerDay: 5,
  streakBonusMax: 50,
  /** Needs every question, so it exists in the engine but is hidden on free. */
  perfectVideo: 25,
} as const;

/** XP for answering a question. Attempt 1 or 2; a wrong second attempt earns nothing. */
export function answerXp(attempt: 1 | 2, correct: boolean): number {
  if (!correct) return 0;
  return attempt === 1 ? XP.correctFirstTry : XP.correctAfterRetry;
}

/** Daily streak bonus: 5 × streak day, capped at 50. */
export function streakBonus(streakDay: number): number {
  if (streakDay < 1) return 0;
  return Math.min(XP.streakBonusPerDay * Math.floor(streakDay), XP.streakBonusMax);
}
