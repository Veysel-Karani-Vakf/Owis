// Resolves however a video was supplied — an uploaded file or a YouTube link —
// into the one thing players need to know: what to render.
//
// Editors pick "upload a video" or "paste a YouTube link" in the dashboard;
// neither option requires them to know what a video ID is.

export type VideoSource =
  | { kind: 'file'; src: string }
  | { kind: 'youtube'; id: string }
  | null;

/** Any URL that points at a playable file rather than a hosting page. */
const VIDEO_FILE = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?|#|$)/i;

const YOUTUBE_ID =
  /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([A-Za-z0-9_-]{11})/;

/** A bare 11-character YouTube ID, as stored by the original content files. */
const BARE_ID = /^[A-Za-z0-9_-]{11}$/;

export function extractYouTubeId(value: string | null | undefined): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (BARE_ID.test(trimmed)) return trimmed;
  return trimmed.match(YOUTUBE_ID)?.[1] ?? '';
}

export function isVideoFileUrl(value: string | null | undefined): boolean {
  return Boolean(value && VIDEO_FILE.test(value.trim()));
}

export type VideoFields = {
  /** Public URL of a video uploaded through the dashboard. */
  videoFile?: string | null;
  /** YouTube ID, kept for content that came from the original site. */
  videoId?: string | null;
  /** The video's page — a YouTube watch URL, or the file itself. */
  sourceUrl?: string | null;
};

/** An uploaded file always wins; otherwise fall back to YouTube. */
export function resolveVideo(fields: VideoFields | null | undefined): VideoSource {
  if (!fields) return null;

  const file = fields.videoFile?.trim();
  if (file) return { kind: 'file', src: file };

  const id = extractYouTubeId(fields.videoId) || extractYouTubeId(fields.sourceUrl);
  if (id) return { kind: 'youtube', id };

  const source = fields.sourceUrl?.trim();
  if (source && VIDEO_FILE.test(source)) return { kind: 'file', src: source };

  return null;
}

/** Poster frame YouTube generates for a video, used when none was uploaded. */
export function youTubePoster(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/** Embed URL for the privacy-preserving YouTube host. */
export function youTubeEmbedUrl(id: string, params: Record<string, string | number>): string {
  const query = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  );
  return `https://www.youtube-nocookie.com/embed/${id}?${query.toString()}`;
}
