'use client';

import { cn } from '@/lib/utils';

interface AyahMarkerProps {
  ayah: number;
  className?: string;
}

/**
 * Converts standard digits to Arabic-Indic digits (٠١٢٣٤٥٦٧٨٩)
 */
const toArabicDigits = (num: number) => {
  return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d, 10)]);
};

/**
 * AyahMarker component that renders an authentic decorative frame around the ayah number,
 * based on the traditional King Fahd Complex (Medina Mushaf) style.
 */
export function AyahMarker({ ayah, className }: AyahMarkerProps) {
  const digits = toArabicDigits(ayah);
  const isLarge = ayah >= 100;
  
  return (
    <span 
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center align-middle mx-1.5 transition-all duration-300 hover:scale-110 group overflow-visible",
        className
      )}
      aria-label={`آية ${ayah}`}
    >
      {/* Ornamental Frame (SVG) - Medina Mushaf Style */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full drop-shadow-sm overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main decorative shape: Heptagonal floral frame with gold/secondary gradient feel */}
        <path
          d="M50 4.5 L58 8 L68 10 L76 16 L84 24 L88 34 L92 44 L92 56 L88 66 L84 76 L76 84 L68 90 L58 92 L50 95.5 L42 92 L32 90 L24 84 L16 76 L12 66 L8 56 L8 44 L12 34 L16 24 L24 16 L32 10 L42 8 Z"
          className="fill-secondary/10 stroke-secondary"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Inner circle border */}
        <circle 
          cx="50" 
          cy="50" 
          r="33" 
          className="fill-none stroke-secondary/40" 
          strokeWidth="1.5"
        />
        
        {/* Outer accent dots - 8 points */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <circle
            key={angle}
            cx={50 + 43 * Math.cos((angle * Math.PI) / 180)}
            cy={50 + 43 * Math.sin((angle * Math.PI) / 180)}
            r="2"
            className="fill-secondary"
          />
        ))}
        
        {/* Decorative floral flourishes at cardinal points */}
        <path d="M50 12 L52 18 L48 18 Z" className="fill-secondary" />
        <path d="M50 88 L52 82 L48 82 Z" className="fill-secondary" />
        <path d="M12 50 L18 52 L18 48 Z" className="fill-secondary" />
        <path d="M88 50 L82 52 L82 48 Z" className="fill-secondary" />
      </svg>
      
      {/* Ayah Number */}
      <span className={cn(
        "relative z-10 font-bold text-on-secondary-container font-serif mt-0.5 tracking-tighter leading-none flex items-center justify-center",
        isLarge ? "text-[10px]" : "text-[12px]"
      )}>
        {digits}
      </span>
    </span>
  );
}
