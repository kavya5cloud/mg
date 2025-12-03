import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      aria-label="MOCA Logo"
    >
      {/* Top Left: M (Square) */}
      <rect x="0" y="0" width="50" height="50" fill="currentColor" />
      
      {/* Top Right: O (Circle) */}
      <circle cx="75" cy="25" r="25" fill="currentColor" />
      
      {/* Bottom Left: C (Semi-Circle / Geometric C) */}
      <path d="M50 50 H0 V100 H50 A25 25 0 0 1 50 50 Z" fill="currentColor" transform="rotate(180 25 75)" />
      {/* Actually, a cleaner C representation in this grid style might be a simple arc or half circle. 
         Let's do a semi-circle facing right.
      */}
      <path d="M25 50 A25 25 0 0 0 25 100 V50 Z" fill="currentColor" transform="translate(0, 0) scale(2, 1)"/> 
      {/* Let's try a simpler shape: A circle with a chunk taken out, or just a semi circle. 
         Let's stick to the 4-quadrant grid strictly.
         Quad 3 (0,50 to 50,100): Semi-circle
      */}
      <path d="M50 50 V100 A25 25 0 0 1 50 50 Z" fill="currentColor" />

      {/* Bottom Right: A (Triangle) */}
      <path d="M50 100 L75 50 L100 100 H50 Z" fill="currentColor" />
    </svg>
  );
};

export const LogoGeometric: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => {
    // A more refined Bauhaus style version based on the 2x2 grid
    return (
        <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            {/* Top Left: Square */}
            <rect x="5" y="5" width="42" height="42" />
            {/* Top Right: Circle */}
            <circle cx="74" cy="26" r="21" />
            {/* Bottom Left: Semi Circle */}
            <path d="M47 74 A 21 21 0 0 1 5 74 L 5 74 Z" transform="rotate(-90 26 74) translate(21, 0)" /> 
            {/* Let's do a simple path for C */}
            <path d="M47 53 V95 H5 C5 95 5 53 47 53 Z M 26 95 A 21 21 0 0 0 26 53 A 21 21 0 0 0 26 95" fillRule="evenodd" fill="transparent"/> {/* This is too complex */}
            
            {/* Re-doing simpler grid shapes for reliability */}
            <g>
                <rect x="0" y="0" width="48" height="48" /> {/* M */}
                <circle cx="74" cy="24" r="24" /> {/* O */}
                <path d="M24 52 A 24 24 0 0 0 24 100 V 52 Z" /> {/* C - Left half circle */}
                <path d="M52 100 L76 52 L100 100 Z" /> {/* A - Triangle */}
            </g>
        </svg>
    )
}

export default LogoGeometric;