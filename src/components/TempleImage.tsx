import { useState } from 'react';
import { Flame } from 'lucide-react';

interface TempleImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function TempleImage({ src, alt, className = '' }: TempleImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F4ECE1] via-[#EFE3D2] to-[#E5D3BC] text-[#7A1C1C] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full bg-[#7A1C1C]/10 flex items-center justify-center mb-3">
          <Flame className="w-6 h-6 text-[#D97706]" />
        </div>
        <span className="font-display text-sm font-semibold text-[#7A1C1C] max-w-[200px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
