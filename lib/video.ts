export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null;

  const trimmed = input.trim();

  // If input contains iframe tag, extract src attribute first
  let targetStr = trimmed;
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch && srcMatch[1]) {
    targetStr = srcMatch[1];
  }

  // Pattern 1: Shorts (youtube.com/shorts/ID)
  const shortsMatch = targetStr.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // Pattern 2: Standard watch (youtube.com/watch?v=ID)
  const watchMatch = targetStr.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // Pattern 3: Shortened (youtu.be/ID)
  const youtuBeMatch = targetStr.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (youtuBeMatch && youtuBeMatch[1]) return youtuBeMatch[1];

  // Pattern 4: Embed URL (youtube.com/embed/ID)
  const embedMatch = targetStr.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // Pattern 5: Any 11-char string if youtu is present
  if (targetStr.toLowerCase().includes('youtu')) {
    const generalMatch = targetStr.match(/([a-zA-Z0-9_-]{11})/);
    if (generalMatch && generalMatch[1]) return generalMatch[1];
  }

  return null;
}

export function getYouTubeEmbedUrl(input: string): string | null {
  const id = extractYouTubeVideoId(input);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0` : null;
}

export function getYouTubeThumbnailUrl(input: string): string | null {
  const id = extractYouTubeVideoId(input);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}


