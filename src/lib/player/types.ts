/**
 * The player abstraction. The lesson player and the quiz engine only talk to
 * this interface, so a Bunny Stream adapter (signed HLS, 360p/480p) can
 * replace YouTube later without touching quiz logic.
 */
export type VideoSource = { provider: "youtube"; id: string } | { provider: "bunny"; id: string };

export type PlayerEvent = "ready" | "play" | "pause" | "ended" | "buffering" | "error";

export interface PlayerAdapter {
  /** Mounts the player into `host` and resolves once it can take commands. */
  load(host: HTMLElement, source: VideoSource, options?: { startSeconds?: number }): Promise<void>;
  play(): void;
  pause(): void;
  seek(seconds: number): void;
  /** Current position in seconds. Cheap enough to call every animation frame. */
  getCurrentTime(): number;
  getDuration(): number;
  isPlaying(): boolean;
  on(event: PlayerEvent, listener: () => void): () => void;
  destroy(): void;
}
