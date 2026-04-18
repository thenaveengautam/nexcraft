import React from 'react';

// Futuristic Holographic AI Core Logo
export const NexcraftLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center shrink-0 group ${className}`}>
    
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300">
      <defs>
        <linearGradient id="cyan-violet-logo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        
        <linearGradient id="violet-pink-logo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
        
        <filter id="logo-shadow-main" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="-5" dy="0" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
        </filter>
      </defs>

      <g strokeLinejoin="round" strokeLinecap="round">
        <polygon points="6,20 41,50 6,80 36,80 71,50 36,20" fill="url(#cyan-violet-logo)" stroke="url(#cyan-violet-logo)" strokeWidth="4" />
        <polygon points="31,20 66,50 31,80 61,80 96,50 61,20" fill="url(#violet-pink-logo)" stroke="url(#violet-pink-logo)" strokeWidth="4" filter="url(#logo-shadow-main)" />
        
        <line x1="36" y1="20" x2="71" y2="50" stroke="#ffffff" strokeWidth="2" opacity="0.4" />
        <line x1="61" y1="20" x2="96" y2="50" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        <line x1="6" y1="20" x2="41" y2="50" stroke="#ffffff" strokeWidth="2" opacity="0.3" />
      </g>
    </svg>
  </div>
);
