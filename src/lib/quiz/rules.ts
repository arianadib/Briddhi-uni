/**
 * Pacing rules for quiz banks (docs/BUILD_PROMPT.md §5). One place, so the
 * builder, the import, the approve action and the catalogue all agree.
 */
export const quizRules = {
  /** No pause point in the first 30 seconds. */
  minFirstPauseSeconds: 30,
  /** At least 45 seconds between pause points. */
  minGapSeconds: 45,
  /** Exactly one free question per video. */
  freeQuestionsPerVideo: 1,
  /** Target around 9 questions; warn outside 6–12. */
  targetQuestions: 9,
  warnBelow: 6,
  warnAbove: 12,
  /** Pro teaser length. */
  proTeaserSeconds: 3,
} as const;

/**
 * The shortest video that can hold a full bank under the pacing rules:
 * first question at 30s, then 8 more 45s apart, so 390s (6.5 minutes).
 * Shorter videos are "shorts": no quiz, and skipped in Uni for now.
 */
export const MIN_QUIZ_VIDEO_SECONDS =
  quizRules.minFirstPauseSeconds + (quizRules.targetQuestions - 1) * quizRules.minGapSeconds;
