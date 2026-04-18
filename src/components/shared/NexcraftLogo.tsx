import React from 'react';

// Futuristic Holographic AI Core Logo
export const NexcraftLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center shrink-0 group ${className}`}>
    
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-[140%] h-[140%] drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-500">
      <defs>
        <radialGradient id="ai-sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#4c1d95" />
        </radialGradient>
        <linearGradient id="ai-ring-1" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="ai-ring-2" x1="100" y1="0" x2="0" y2="100">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>

      {/* Orbiting Quantum Energy Rings (Spinning comet-like dashes) */}
      <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: 'center' }}>
        <ellipse cx="50" cy="50" rx="35" ry="12" fill="none" stroke="url(#ai-ring-1)" strokeWidth="2.5" opacity="0.9" strokeLinecap="round" strokeDasharray="120 60" transform="rotate(45 50 50)" />
      </g>
      <g className="animate-[spin_5s_linear_infinite_reverse]" style={{ transformOrigin: 'center' }}>
        <ellipse cx="50" cy="50" rx="38" ry="14" fill="none" stroke="url(#ai-ring-2)" strokeWidth="2.5" opacity="0.9" strokeLinecap="round" strokeDasharray="130 70" transform="rotate(-45 50 50)" />
      </g>
      
      {/* Massive Central AI Generation Star */}
      <path d="M50 5 C 50 5, 55 45, 95 50 C 55 55, 50 95, 50 95 C 50 95, 45 55, 5 50 C 45 45, 50 5, 50 5 Z" fill="url(#ai-sun-glow)" className="animate-pulse" style={{ animationDuration: '2s' }} />
      
      {/* Central Super-bright Core */}
      <circle cx="50" cy="50" r="14" fill="#ffffff" opacity="0.5" filter="blur(4px)" />
      <circle cx="50" cy="50" r="6" fill="#ffffff" />
      
      {/* Orbiting Tiny Magic Sparkles */}
      <path d="M80 20 C 80 20, 81.5 28, 90 30 C 81.5 32, 80 40, 80 40 C 80 40, 78.5 32, 70 30 C 78.5 28, 80 20, 80 20 Z" fill="#22d3ee" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
      <path d="M25 75 C 25 75, 26 81, 32 82 C 26 83, 25 89, 25 89 C 25 89, 24 83, 18 82 C 24 81, 25 75, 25 75 Z" fill="#f472b6" className="animate-pulse" style={{ animationDelay: '1s', animationDuration: '2s' }} />
    </svg>
  </div>
);
