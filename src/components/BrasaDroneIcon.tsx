import React from 'react';

interface BrasaDroneIconProps {
  className?: string;
  color?: string;
  size?: number;
}

export default function BrasaDroneIcon({ className = '', color = 'currentColor', size = 24 }: BrasaDroneIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Central Filled Circle */}
      <circle cx="20" cy="20" r="4.5" fill={color} />

      {/* 4 Diagonal Arms */}
      <line x1="20" y1="20" x2="28.5" y2="11.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="20" x2="11.5" y2="11.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="20" x2="11.5" y2="28.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="20" x2="28.5" y2="28.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />

      {/* 4 Rotor Circles at Extremities */}
      <circle cx="28.5" cy="11.5" r="3.5" stroke={color} strokeWidth="1.2" fill="none" />
      <circle cx="11.5" cy="11.5" r="3.5" stroke={color} strokeWidth="1.2" fill="none" />
      <circle cx="11.5" cy="28.5" r="3.5" stroke={color} strokeWidth="1.2" fill="none" />
      <circle cx="28.5" cy="28.5" r="3.5" stroke={color} strokeWidth="1.2" fill="none" />
    </svg>
  );
}
