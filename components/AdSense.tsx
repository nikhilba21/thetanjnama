'use client';
import { useEffect } from 'react';

interface AdSenseProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSense({ slot, format = 'auto', style, className }: AdSenseProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT || '';

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && client) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense push error:', e);
    }
  }, [client, adSlot]);

  if (!client) {
    return (
      <div className="adsense-container">
        <span className="ad-label">ADVERTISEMENT / विज्ञापन</span>
        <div className="adsense-placeholder">
          <b>Google AdSense Place</b>
          <p style={{ fontSize: '11px', marginTop: '4px' }}>
            Set <code>NEXT_PUBLIC_ADSENSE_CLIENT</code> on Vercel to activate live Google ads.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className || ''}`}>
      <span className="ad-label">ADVERTISEMENT / विज्ञापन</span>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', minHeight: '90px' }}
        data-ad-client={client}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
