import records from "./recordedVideoCases.json" with { type: "json" };

export interface CaseVideo {
  src: string;
  poster: string;
  captions: string;
  durationSeconds: number;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  chapters: { start: number; end: number; text: string }[];
}

export interface RecordedVideoCase {
  slug: string;
  title: string;
  serviceType: string;
  serviceLabel: string;
  servicePath: string;
  summary: string;
  problem: string;
  workPerformed: string;
  result: string;
  publishedAt: string;
  district?: string;
  projectDate?: string;
  video: CaseVideo;
}

// This reviewed collection is published with the site; it is independent of CMS
// drafts. The edit manifest preserves the actual video length and caption cues.
export const RECORDED_VIDEO_CASES: RecordedVideoCase[] = records;
