/** Level thresholds from the brief (docs/BUILD_PROMPT.md §8). */
export const levels = [
  { level: 1, minXp: 0 },
  { level: 2, minXp: 300 },
  { level: 3, minXp: 900 },
  { level: 4, minXp: 2000 },
  { level: 5, minXp: 4000 },
] as const;

export type LevelNumber = (typeof levels)[number]["level"];

export type LevelProgress = {
  level: LevelNumber;
  /** XP at which the current level started. */
  floor: number;
  /** XP needed for the next level, or null at the top level. */
  next: number | null;
  /** 0–1 progress towards the next level (1 at the top level). */
  progress: number;
};

export function levelFor(totalXp: number): LevelProgress {
  const xp = Math.max(0, Math.floor(totalXp));
  let index = 0;
  while (index + 1 < levels.length && xp >= levels[index + 1].minXp) index++;
  const current = levels[index];
  const upcoming = levels[index + 1];
  if (!upcoming) return { level: current.level, floor: current.minXp, next: null, progress: 1 };
  return {
    level: current.level,
    floor: current.minXp,
    next: upcoming.minXp,
    progress: (xp - current.minXp) / (upcoming.minXp - current.minXp),
  };
}
