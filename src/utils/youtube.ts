export const youtubeHosts = ['https://www.youtube-nocookie.com', 'https://www.youtube.com'] as const;

function cleanYouTubeId(value: string) {
  const candidate = value.trim().split(/[?&#]/)[0] ?? '';
  const match = candidate.match(/[A-Za-z0-9_-]{6,}/);
  return match?.[0] ?? '';
}

export function getYouTubeVideoId(value: string) {
  const input = value.trim();
  if (!input) return '';

  try {
    const url = new URL(input);
    const hostname = url.hostname.replace(/^m\./, 'www.');

    if (hostname === 'youtu.be') {
      return cleanYouTubeId(url.pathname.split('/').filter(Boolean)[0] ?? '');
    }

    if (hostname === 'www.youtube.com' || hostname.endsWith('.youtube.com') || hostname.endsWith('.youtube-nocookie.com')) {
      const watchId = url.searchParams.get('v');
      if (watchId) return cleanYouTubeId(watchId);

      const parts = url.pathname.split('/').filter(Boolean);
      const videoPathKeys = new Set(['embed', 'shorts', 'live']);
      const keyedIndex = parts.findIndex((part) => videoPathKeys.has(part));

      if (keyedIndex >= 0) {
        return cleanYouTubeId(parts[keyedIndex + 1] ?? '');
      }

      const nestedUrl = url.searchParams.get('u');
      if (nestedUrl) return getYouTubeVideoId(nestedUrl);
    }
  } catch {
    return cleanYouTubeId(input);
  }

  return cleanYouTubeId(input);
}

export function getYouTubeWatchUrl(value: string) {
  const videoId = getYouTubeVideoId(value);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : value;
}

export function parseYouTubeMessage(data: unknown): Record<string, unknown> | null {
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as unknown;
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  }

  return data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
}

export function isTrustedYouTubeOrigin(origin: string) {
  try {
    const hostname = new URL(origin).hostname;
    return (
      hostname === 'www.youtube.com' ||
      hostname === 'www.youtube-nocookie.com' ||
      hostname.endsWith('.youtube.com') ||
      hostname.endsWith('.youtube-nocookie.com')
    );
  } catch {
    return false;
  }
}
