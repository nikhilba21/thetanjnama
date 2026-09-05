'use client';
import { getYouTubeEmbedUrl } from '@/lib/video';

interface VideoPlayerProps {
  videoUrl?: string | null;
  title?: string;
  className?: string;
}

export default function VideoPlayer({ videoUrl, title = 'Video News', className = '' }: VideoPlayerProps) {
  if (!videoUrl || !videoUrl.trim()) return null;

  const trimmed = videoUrl.trim();

  // If raw iframe HTML is provided
  if (trimmed.startsWith('<iframe') || (trimmed.includes('<iframe') && trimmed.includes('</iframe>'))) {
    const embedUrl = getYouTubeEmbedUrl(trimmed);
    if (embedUrl) {
      return (
        <div
          className={`video-player-container ${className}`}
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 Aspect Ratio
            background: '#000000',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            margin: '18px 0'
          }}
        >
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        </div>
      );
    }
  }

  const embedUrl = getYouTubeEmbedUrl(trimmed);

  if (!embedUrl) {
    return (
      <div style={{ background: '#000', color: '#fff', padding: '16px', borderRadius: '8px', textAlign: 'center', fontSize: '13px' }}>
        🎥 <a href={trimmed} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 700 }}>
          यहाँ क्लिक करके वीडियो देखें
        </a>
      </div>
    );
  }

  return (
    <div
      className={`video-player-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9 Aspect Ratio
        background: '#000000',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        margin: '18px 0'
      }}
    >
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none'
        }}
      />
    </div>
  );
}

