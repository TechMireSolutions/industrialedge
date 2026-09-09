import React from 'react';

export default function HeroBackground() {
  return (
    <div className="hero-background-wrapper" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>

      <style>{`
        .hero-background-wrapper {
          pointer-events: none;
        }
      `}</style>

      {/* Atmospheric Base in case slides have no background */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: '#05040d' }}></div>

      {/* Smooth transition fade to white background of the next section */}
      <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '150px', background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 60%, #ffffff 100%)', zIndex: 3 }}></div>
    </div>
  );
}
