import React from 'react';
import { BriefcaseBusiness } from 'lucide-react';

interface BrandLogoProps {
  light?: boolean;
  showMark?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ light = false, showMark = true }) => {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      {showMark && (
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
            light ? 'bg-white/10 text-white' : 'bg-[#172554] text-white'
          }`}
          aria-hidden="true"
        >
          <BriefcaseBusiness className="h-4 w-4" />
        </span>
      )}
      <span
        className={`font-display text-lg font-bold tracking-tight ${
          light ? 'text-white' : 'text-[#172554]'
        }`}
      >
        WorkConnect
      </span>
    </span>
  );
};
