'use client';
import { useEffect } from 'react';

interface AdSenseProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdSense({ slot, format = 'auto', style, className }: AdSenseProps) {
  const client =
    process.env.ADSENSE_CLIENT ||
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
    'ca-pub-3935952599641519';

  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT || '';

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('AdSense push notice:', e);
    }
  }, [client, adSlot]);

  const defaultMinHeight = format === 'horizontal' ? '90px' : '250px';

  return (
    <div className={`adsense-container ${className || ''}`} style={{ margin: '20px 0', textAlign: 'center', minHeight: defaultMinHeight, overflow: 'hidden' }}>
      <span className="ad-label" style={{ display: 'block', fontSize: '10px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        ADVERTISEMENT / विज्ञापन
      </span>
      <ins
        className="adsbygoogle"
        style={style || { display: 'block', minHeight: defaultMinHeight, width: '100%' }}
        data-ad-client={client}
        {...(adSlot ? { 'data-ad-slot': adSlot } : {})}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
