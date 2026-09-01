'use client';
import { useEffect, useState } from 'react';

type TickerItem = {
  id: string;
  text: string;
};

export default function BreakingTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    async function loadTicker() {
      try {
        const res = await fetch('/api/ticker');
        if (res.ok) {
          const data = await res.json();
          if (typeof data.active === 'boolean') {
            setIsActive(data.active);
          }
          if (data.items && Array.isArray(data.items)) {
            setItems(data.items);
          }
        }
      } catch (e) {
        console.warn('Ticker load error');
      }
    }
    loadTicker();
  }, []);

  // Hides ticker completely if admin has deactivated it or no items exist
  if (!isActive || items.length === 0) {
    return null;
  }

  return (
    <div className="breaking-ticker-wrapper">
      <div className="container breaking-inner-box">
        {/* Blinking Red Pulse Indicator */}
        <div className="ticker-label">
          <span className="blinking-red-dot"></span>
          <span>ताजा अपडेट</span>
        </div>

        {/* Auto Scrolling Marquee Track */}
        <div className="marquee-viewport">
          <div className="marquee-track">
            {/* Render duplicates for seamless looping marquee */}
            {[...items, ...items].map((item, index) => (
              <span key={`${item.id}-${index}`} className="ticker-headline-item">
                <span className="ticker-bullet">✦</span> {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
