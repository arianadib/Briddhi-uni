/**
 * The pause-point engine. Pure functions, no player or React: the lesson
 * player feeds it times and seeks, and it says when to stop and where to go.
 *
 * Rules (docs/BUILD_PROMPT.md §3–4):
 * - Playback stops precisely at each pending pause point.
 * - The free question can't be skipped: seeking past it glides back to it.
 * - Pro questions never block: seeking past one simply skips it.
 */

export type StopTier = "free" | "pro";
export type StopStatus = "pending" | "answered" | "teased" | "skipped";

export type Stop = { id: string; at: number; tier: StopTier; status: StopStatus };

/**
 * How far ahead of a pause point to stop. The player polls every animation
 * frame (~16ms at 60fps, ~33ms on slow phones), so stopping one frame early
 * lands on the mark instead of just past it.
 */
export const STOP_LOOKAHEAD_SECONDS = 0.05;

/** Where the video lands when it glides back to an unanswered free question. */
export const GLIDE_BACK_LEAD_SECONDS = 1.5;

export function createStops(
  points: Array<{ id: string; atSeconds: number; tier: StopTier }>,
): Stop[] {
  return points
    .map((p) => ({ id: p.id, at: p.atSeconds, tier: p.tier, status: "pending" as const }))
    .sort((a, b) => a.at - b.at);
}

/**
 * During normal playback from `previous` to `current` seconds, returns the
 * pending stop that playback has just reached, or null.
 */
export function stopReached(stops: Stop[], previous: number, current: number): Stop | null {
  for (const stop of stops) {
    if (stop.status !== "pending") continue;
    // Seeks go through resolveSeek, so any forward step seen here is playback,
    // including a dropped frame or a buffering hiccup that jumps past the mark.
    if (stop.at > previous && stop.at <= current + STOP_LOOKAHEAD_SECONDS) return stop;
  }
  return null;
}

export type SeekDecision = {
  /** Where the video should actually go. */
  target: number;
  /** True when the learner tried to jump past an unanswered free question. */
  glidedBack: boolean;
  /** The stops after the seek; Pro stops that were jumped over become "skipped". */
  stops: Stop[];
};

/** Decides what a seek from `from` to `to` should do. */
export function resolveSeek(stops: Stop[], from: number, to: number): SeekDecision {
  if (to <= from) return { target: to, glidedBack: false, stops };

  const blockingFree = stops.find(
    (s) => s.tier === "free" && s.status === "pending" && s.at > from && s.at < to,
  );
  const end = blockingFree ? blockingFree.at : to;
  const target = blockingFree ? Math.max(from, blockingFree.at - GLIDE_BACK_LEAD_SECONDS) : to;

  const next = stops.map((s) =>
    s.tier === "pro" && s.status === "pending" && s.at > from && s.at < end
      ? { ...s, status: "skipped" as const }
      : s,
  );
  return { target, glidedBack: Boolean(blockingFree), stops: next };
}

export function markStop(stops: Stop[], id: string, status: StopStatus): Stop[] {
  return stops.map((s) => (s.id === id ? { ...s, status } : s));
}

/** For the progress bar: what each tick should look like. */
export function tickState(stop: Stop): "answered" | "upcoming" | "pro" {
  if (stop.tier === "pro") return "pro";
  return stop.status === "answered" ? "answered" : "upcoming";
}
