"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Learner progress: XP, answered questions and where each video was left.
 *
 * TEMPORARY: until the database and sign-in land (step 6), this lives in the
 * browser's localStorage. The shape mirrors the server tables
 * (xp_events, answers, video_progress) so swapping in server actions is a
 * change inside this file only. Every read and write tolerates storage
 * being unavailable (private mode, blocked site data).
 */

export type XpKind = "answer_first_try" | "answer_retry" | "video_complete";

type State = {
  xpEvents: Array<{ kind: XpKind; refId: string; amount: number; at: string }>;
  answers: Record<string, { correct: boolean; attempt: 1 | 2 }>;
  positions: Record<string, number>;
  completed: Record<string, string>;
};

const KEY = "uni.progress.v1";
const empty: State = { xpEvents: [], answers: {}, positions: {}, completed: {} };

let cache: State | null = null;
const listeners = new Set<() => void>();

function read(): State {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...empty, ...(JSON.parse(raw) as State) } : empty;
  } catch {
    cache = empty;
  }
  return cache;
}

function write(next: State) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: progress still works for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function totalXp(state: State = read()): number {
  return state.xpEvents.reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Awards XP once per (kind, refId). Returns the amount awarded, or 0 when it
 * was already awarded, so a double tap or a replay can never pay twice.
 */
export function awardXp(kind: XpKind, refId: string, amount: number): number {
  const state = read();
  if (amount <= 0 || state.xpEvents.some((e) => e.kind === kind && e.refId === refId)) return 0;
  write({
    ...state,
    xpEvents: [...state.xpEvents, { kind, refId, amount, at: new Date().toISOString() }],
  });
  return amount;
}

export function recordAnswer(questionId: string, correct: boolean, attempt: 1 | 2) {
  const state = read();
  write({ ...state, answers: { ...state.answers, [questionId]: { correct, attempt } } });
}

export function answeredIds(): Set<string> {
  return new Set(Object.keys(read().answers));
}

export function savePosition(videoId: string, seconds: number) {
  const state = read();
  write({ ...state, positions: { ...state.positions, [videoId]: Math.floor(seconds) } });
}

export function savedPosition(videoId: string): number {
  return read().positions[videoId] ?? 0;
}

export function markCompleted(videoId: string) {
  const state = read();
  if (state.completed[videoId]) return;
  write({ ...state, completed: { ...state.completed, [videoId]: new Date().toISOString() } });
}

/** The learner's total XP, kept in sync across components. 0 during server render. */
export function useTotalXp(): number {
  const get = useCallback(() => totalXp(), []);
  return useSyncExternalStore(subscribe, get, () => 0);
}
