'use client';
import { useState } from 'react';

interface SocialShareBarProps {
  title: string;
  url: string;
  subtext?: string;
}

export default function SocialShareBar({ title, url, subtext }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const fullShareText = subtext ? `${title}\n\n${subtext}\n👉 यहाँ उत्तर/राय दर्ज करें: ` : `${title}\n👉 यहाँ देखें व हिस्सा लें: `;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText + url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      className="social-share-widget"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px 20px',
        margin: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}
    >
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>📲 सोशल मीडिया पर शेयर करें (Share on Social Media):</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* WHATSAPP */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#25D366',
            color: '#ffffff',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          💬 WhatsApp
        </a>

        {/* FACEBOOK */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#1877F2',
            color: '#ffffff',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          👍 Facebook
        </a>

        {/* TWITTER / X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#000000',
            color: '#ffffff',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          ✖ X (Twitter)
        </a>

        {/* TELEGRAM */}
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#229ED9',
            color: '#ffffff',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          ✈️ Telegram
        </a>

        {/* COPY LINK BUTTON */}
        <button
          onClick={handleCopy}
          type="button"
          style={{
            background: copied ? '#166534' : '#64748b',
            color: '#ffffff',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {copied ? '✅ लिंक कॉपी हो गया!' : '📋 लिंक कॉपी करें'}
        </button>
      </div>
    </div>
  );
}
