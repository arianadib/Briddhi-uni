import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findVideo, isQuizEligible } from "@/lib/catalog";
import { visibleBankFor } from "@/lib/quiz/banks";
import { LessonPlayer, type FreeQuestion, type LessonStop } from "./LessonPlayer";

type Params = { series: string; video: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { series, video } = await params;
  const found = findVideo(series, video);
  return { title: found ? found.video.titleEn : "Lesson" };
}

/**
 * A lesson. A learner sees it only when the video is published, long enough
 * for a quiz, and has a bank they're allowed to see.
 */
export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { series: seriesId, video: videoId } = await params;
  const found = findVideo(seriesId, videoId);
  if (!found || !isQuizEligible(found.video) || !found.video.youtubeId) notFound();
  const bank = await visibleBankFor(found.video.id);
  if (!bank) notFound();

  const { series, video } = found;

  // Only timing and tier reach the browser for Pro questions: their text is
  // Pro content and never leaves the server.
  const stops: LessonStop[] = bank.pausePoints.map((p) => ({
    id: p.id,
    at: p.atSeconds,
    tier: p.question.tier,
  }));
  const free = bank.pausePoints.find((p) => p.question.tier === "free");
  // TEMPORARY: the correct answer is sent to the browser until answers are
  // checked by a server action (step 6).
  const freeQuestion: FreeQuestion | null = free
    ? {
        stopId: free.id,
        promptBn: free.question.promptBn,
        promptEn: free.question.promptEn,
        options: free.question.options,
        correctIndex: free.question.correctIndex,
        explanationBn: free.question.explanationBn,
        explanationEn: free.question.explanationEn,
      }
    : null;

  return (
    <LessonPlayer
      video={{
        id: video.id,
        youtubeId: video.youtubeId!,
        titleBn: video.titleBn,
        titleEn: video.titleEn,
        episode: video.episode,
        durationSeconds: video.durationSeconds ?? 0,
      }}
      series={{
        id: series.id,
        titleBn: series.titleBn,
        titleEn: series.titleEn,
        partner: series.partner,
      }}
      stops={stops}
      freeQuestion={freeQuestion}
      isSample={bank.isSample}
    />
  );
}
