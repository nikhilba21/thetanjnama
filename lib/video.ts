export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const trimmed = url.trim();

  // Pattern 1: Shorts (youtube.com/shorts/ID)
  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // Pattern 2: Standard watch (youtube.com/watch?v=ID)
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // Pattern 3: Shortened (youtu.be/ID)
  const youtuBeMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch && youtuBeMatch[1]) return youtuBeMatch[1];

  // Pattern 4: Embed URL (youtube.com/embed/ID)
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  return null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0` : null;
}
