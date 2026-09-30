import { describe, expect, it } from "vitest";
import {
  GLIDE_BACK_LEAD_SECONDS,
  createStops,
  markStop,
  resolveSeek,
  stopReached,
  tickState,
} from "./engine";

const stops = createStops([
  { id: "pro-2", atSeconds: 300, tier: "pro" },
  { id: "free", atSeconds: 120, tier: "free" },
  { id: "pro-1", atSeconds: 60, tier: "pro" },
]);

describe("createStops", () => {
  it("sorts by time and starts everything pending", () => {
    expect(stops.map((s) => s.id)).toEqual(["pro-1", "free", "pro-2"]);
    expect(stops.every((s) => s.status === "pending")).toBe(true);
  });
});

describe("stopReached", () => {
  it("stops one frame early so playback lands on the mark", () => {
    expect(stopReached(stops, 59.9, 59.96)?.id).toBe("pro-1");
  });
  it("does nothing between stops", () => {
    expect(stopReached(stops, 61, 61.02)).toBeNull();
  });
  it("still stops after a dropped frame jumps past the mark", () => {
    expect(stopReached(stops, 119.9, 120.4)?.id).toBe("free");
  });
  it("ignores stops that are already handled", () => {
    const done = markStop(stops, "pro-1", "teased");
    expect(stopReached(done, 59.9, 60.1)).toBeNull();
  });
});

describe("resolveSeek", () => {
  it("glides back to an unanswered free question", () => {
    const d = resolveSeek(stops, 100, 200);
    expect(d.glidedBack).toBe(true);
    expect(d.target).toBe(120 - GLIDE_BACK_LEAD_SECONDS);
  });
  it("never glides back further than where the learner was", () => {
    expect(resolveSeek(stops, 119.5, 200).target).toBe(119.5);
  });
  it("lets the learner seek freely once the free question is answered", () => {
    const answered = markStop(stops, "free", "answered");
    const d = resolveSeek(answered, 100, 400);
    expect(d).toMatchObject({ target: 400, glidedBack: false });
  });
  it("skips Pro questions that are jumped over: they never block", () => {
    const answered = markStop(stops, "free", "answered");
    const d = resolveSeek(answered, 0, 400);
    expect(d.stops.find((s) => s.id === "pro-1")?.status).toBe("skipped");
    expect(d.stops.find((s) => s.id === "pro-2")?.status).toBe("skipped");
  });
  it("only skips Pro questions before the free one when it glides back", () => {
    const d = resolveSeek(stops, 0, 400);
    expect(d.stops.find((s) => s.id === "pro-1")?.status).toBe("skipped");
    expect(d.stops.find((s) => s.id === "pro-2")?.status).toBe("pending");
  });
  it("seeking backwards changes nothing", () => {
    const d = resolveSeek(stops, 200, 10);
    expect(d).toMatchObject({ target: 10, glidedBack: false });
    expect(d.stops).toBe(stops);
  });
});

describe("tickState", () => {
  it("shows answered, upcoming and Pro ticks", () => {
    expect(tickState(stops[0])).toBe("pro");
    expect(tickState(stops[1])).toBe("upcoming");
    expect(tickState(markStop(stops, "free", "answered")[1])).toBe("answered");
  });
});
