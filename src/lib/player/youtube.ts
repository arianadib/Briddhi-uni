import type { PlayerAdapter, PlayerEvent, VideoSource } from "./types";

/* Just the parts of the YouTube IFrame Player API that Uni uses. */
type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
};
type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      host?: string;
      videoId: string;
      width?: string;
      height?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: () => void;
        onStateChange?: (event: { data: number }) => void;
        onError?: (event: { data: number }) => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const STATE = { ended: 0, playing: 1, paused: 2, buffering: 3 } as const;

let apiPromise: Promise<YTNamespace> | null = null;

/** Loads the IFrame API once, on demand (after the learner presses play). */
function loadApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("The video player couldn't load. Check your connection and try again."));
    };
    document.head.appendChild(script);
  });
  return apiPromise;
}

export class YouTubeAdapter implements PlayerAdapter {
  private player: YTPlayer | null = null;
  private listeners = new Map<PlayerEvent, Set<() => void>>();

  async load(host: HTMLElement, source: VideoSource, options?: { startSeconds?: number }) {
    if (source.provider !== "youtube") throw new Error("YouTubeAdapter only plays YouTube videos.");
    const YT = await loadApi();
    // The API replaces the element it's given, so give it a child to replace.
    const mount = document.createElement("div");
    host.replaceChildren(mount);

    await new Promise<void>((resolve) => {
      this.player = new YT.Player(mount, {
        // Privacy-enhanced mode: no cookies until the learner plays.
        host: "https://www.youtube-nocookie.com",
        videoId: source.id,
        width: "100%",
        height: "100%",
        playerVars: {
          controls: 0, // Uni draws its own controls
          disablekb: 1, // and handles the keyboard itself
          fs: 0,
          rel: 0, // related videos only from the same channel (the most the API allows)
          iv_load_policy: 3, // no annotations
          playsinline: 1, // stay inline on iPhone
          cc_load_policy: 0,
          autoplay: 1,
          start: Math.floor(options?.startSeconds ?? 0),
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            resolve();
            this.emit("ready");
          },
          onStateChange: ({ data }) => {
            if (data === STATE.playing) this.emit("play");
            else if (data === STATE.paused) this.emit("pause");
            else if (data === STATE.ended) this.emit("ended");
            else if (data === STATE.buffering) this.emit("buffering");
          },
          onError: () => this.emit("error"),
        },
      });
    });
  }

  play() {
    this.player?.playVideo();
  }
  pause() {
    this.player?.pauseVideo();
  }
  seek(seconds: number) {
    this.player?.seekTo(Math.max(0, seconds), true);
  }
  getCurrentTime() {
    return this.player?.getCurrentTime() ?? 0;
  }
  getDuration() {
    return this.player?.getDuration() ?? 0;
  }
  isPlaying() {
    return this.player?.getPlayerState() === STATE.playing;
  }

  on(event: PlayerEvent, listener: () => void) {
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener);
    this.listeners.set(event, set);
    return () => set.delete(listener);
  }

  destroy() {
    this.listeners.clear();
    this.player?.destroy();
    this.player = null;
  }

  private emit(event: PlayerEvent) {
    this.listeners.get(event)?.forEach((listener) => listener());
  }
}

export function createAdapter(source: VideoSource): PlayerAdapter {
  if (source.provider === "youtube") return new YouTubeAdapter();
  throw new Error("Bunny Stream isn't connected yet.");
}
