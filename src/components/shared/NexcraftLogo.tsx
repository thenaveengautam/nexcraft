import React from 'react';

// Futuristic Holographic AI Core Logo
export const NexcraftLogo = ({ className = "w-8 h-8" }: { className?: string }) => {
  const id = React.useId().replace(/:/g, "");
  const yellowMain = `yellow-main-${id}`;
  const yellowDark = `yellow-dark-${id}`;
  const shadowMain = `logo-shadow-main-${id}`;

  return (
    <div className={`relative flex items-center justify-center shrink-0 group ${className}`}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full group-hover:scale-110 transition-transform duration-150">
        <defs>
          <linearGradient id={yellowMain} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#EAB308" />
          </linearGradient>

          <linearGradient id={yellowDark} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          <filter id={shadowMain} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="-4" dy="0" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
          </filter>
        </defs>

        <g strokeLinejoin="round" strokeLinecap="round">
          {/* Bottom layer */}
          <polygon points="6,20 41,50 6,80 36,80 71,50 36,20" fill={`url(#${yellowDark})`} stroke={`url(#${yellowDark})`} strokeWidth="1" />
          
          {/* Top layer with drop shadow to create 3D overlap */}
          <polygon points="31,20 66,50 31,80 61,80 96,50 61,20" fill={`url(#${yellowMain})`} stroke={`url(#${yellowMain})`} strokeWidth="1" filter={`url(#${shadowMain})`} />

          {/* Edge highlights for premium glassy feel */}
          <line x1="36" y1="20" x2="71" y2="50" stroke="#FEF08A" strokeWidth="2" opacity="0.8" />
          <line x1="61" y1="20" x2="96" y2="50" stroke="#FEF08A" strokeWidth="2" opacity="0.9" />
          <line x1="6" y1="20" x2="41" y2="50" stroke="#FEF08A" strokeWidth="2" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};
