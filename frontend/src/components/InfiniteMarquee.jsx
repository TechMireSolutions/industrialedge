import { getImageUrl } from '../utils/getImageUrl';
import React from 'react';
import './InfiniteMarquee.css';

export default function InfiniteMarquee({ items, speed = 30 }) {
  if (!items || items.length === 0) return null;

  // Guarantee enough items to span a very wide screen (e.g. 4k monitors)
  const minItemsToFillScreen = 10;
  const repeatMultiplier = Math.max(1, Math.ceil(minItemsToFillScreen / items.length));
  const repeatedItems = Array(repeatMultiplier).fill(items).flat();

  return (
    <div className="infinite-marquee-container">
      <div className="infinite-marquee" style={{ animationDuration: `${speed}s` }}>
        {/* First Half */}
        {repeatedItems.map((item, index) => (
          <div key={`first-${index}`} className="marquee-item">
            <img src={getImageUrl(item.logo?.storagePath || item.image)} alt={item.name} title={item.name} />
          </div>
        ))}
        {/* Second Half for seamless loop */}
        {repeatedItems.map((item, index) => (
          <div key={`second-${index}`} className="marquee-item">
            <img src={getImageUrl(item.logo?.storagePath || item.image)} alt={item.name} title={item.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

