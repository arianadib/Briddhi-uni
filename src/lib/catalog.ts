import { z } from "zod";
import raw from "../../content/catalog.json";
import { MIN_QUIZ_VIDEO_SECONDS } from "@/lib/quiz/rules";

const videoSchema = z.object({
  id: z.string().min(1),
  episode: z.number(),
  youtubeId: z.string().min(1).nullable(),
  durationSeconds: z.number().int().positive().nullable(),
  titleEn: z.string().min(1),
  titleBn: z.string().min(1),
  published: z.boolean(),
  interview: z.boolean().optional(),
  note: z.string().optional(),
});

const seriesSchema = z.object({
  id: z.string().min(1),
  titleEn: z.string().min(1),
  titleBn: z.string().min(1),
  partner: z.string().min(1),
  category: z.string().min(1),
  youtubePlaylistId: z.string().nullable(),
  descriptionEn: z.string().min(1),
  descriptionBn: z.string().min(1),
  videos: z.array(videoSchema),
});

const catalogSchema = z.object({
  version: z.literal(1),
  notes: z.array(z.string()),
  series: z.array(seriesSchema),
});

export type CatalogVideo = z.infer<typeof videoSchema>;
export type CatalogSeries = z.infer<typeof seriesSchema>;

/** Parsed once at module load; a malformed catalogue fails the build, not a learner. */
export const catalog = catalogSchema.parse(raw);

/** Shorts are too short for a quiz bank under the pacing rules and are skipped for now. */
export function isShort(video: CatalogVideo): boolean {
  return video.durationSeconds === null || video.durationSeconds < MIN_QUIZ_VIDEO_SECONDS;
}

/** Videos that could appear in Uni: published, playable and long enough for a quiz. */
export function isQuizEligible(video: CatalogVideo): boolean {
  return video.published && video.youtubeId !== null && !isShort(video);
}

export function findVideo(
  seriesId: string,
  videoId: string,
): { series: CatalogSeries; video: CatalogVideo } | null {
  const series = catalog.series.find((s) => s.id === seriesId);
  const video = series?.videos.find((v) => v.id === videoId);
  return series && video ? { series, video } : null;
}
