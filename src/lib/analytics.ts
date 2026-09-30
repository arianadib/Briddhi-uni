/**
 * One analytics helper (docs/BUILD_PROMPT.md §11). Logs to the console for
 * now; swap the body for a real provider later.
 */
export type AnalyticsEvent =
  | "sign_up"
  | "video_started"
  | "video_completed"
  | "question_answered"
  | "pro_teaser_shown"
  | "pro_offer_viewed"
  | "go_pro_clicked"
  | "start_on_briddhi_clicked"
  | "share_card_generated"
  | "level_up"
  | "streak_milestone";

export function track(event: AnalyticsEvent, properties: Record<string, unknown> = {}): void {
  console.info(`[track] ${event}`, properties);
}
