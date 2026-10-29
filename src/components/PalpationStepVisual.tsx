import React from 'react';

interface PalpationStepVisualProps {
  stepNumber: 1 | 2 | 3;
  photoUrl: string;
  photoAlt: string;
  stepTitle?: string;
  effectiveOnline?: boolean;
}

export const PalpationStepVisual: React.FC<PalpationStepVisualProps> = ({
  photoUrl,
  photoAlt,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="relative rounded-2xl overflow-hidden border border-[#dee8ff] aspect-[4/3] bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] shadow-xs group">
        <img
          src={photoUrl}
          alt={photoAlt}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
};