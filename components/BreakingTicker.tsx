'use client';
import { useEffect, useState } from 'react';

type TickerItem = {
  id: string;
  text: string;
};

const defaultItems: TickerItem[] = [
  { id: '1', text: 'TANJNAMA डिजिटल मंच पर आपका स्वागत है — सोच पर तंज, सच के साथ!' },
  { id: '2', text: 'राजस्थान की सियासत में फिर तेज हुई हलचल, बड़े फैसले पर सबकी नजर।' },
  { id: '3', text: 'देश की राजनीति और सामाजिक मुद्दों पर तंजनामा का तीखा निष्पक्ष विश्लेषण।' }
];

export default function BreakingTicker() {
  const [items, setItems] = useState<TickerItem[]>(defaultItems);

  useEffect(() => {
    async function loadTicker() {
      try {
        const res = await fetch('/api/ticker');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setItems(data);
          }
        }
      } catch (e) {
        console.warn('Ticker load error, using default items');
      }
    }
    loadTicker();
  }, []);

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
            {/* Render 2 duplicates for seamless looping marquee */}
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
