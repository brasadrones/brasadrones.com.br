import { useState, useEffect } from 'react';

interface BrasaLogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  alt?: string;
}

export default function BrasaLogo({
  variant = 'light',
  className = '',
  alt = 'BRASA',
}: BrasaLogoProps) {
  const [imgError, setImgError] = useState(false);

  // Reset error state if variant changes
  useEffect(() => {
    setImgError(false);
  }, [variant]);

  // Official BRASA horizontal logo placeholders (symbol + BRASA name)
  const logoSrc =
    variant === 'light'
      ? '/brand/brasa/brasa-logo-horizontal-light.png'
      : '/brand/brasa/brasa-logo-horizontal-dark.png';

  if (imgError) {
    // Silent structural placeholder while official SVG is not yet provided.
    // Reserves visual space without displaying a broken image icon or fake text logo.
    return (
      <div
        className={`inline-flex items-center justify-center relative select-none ${className}`}
        aria-label={alt}
        role="img"
      >
        <div className="w-48 sm:w-64 h-14 sm:h-18 rounded-sm border border-current opacity-15 flex items-center justify-between px-4">
          <div className="w-5 h-5 rounded-full bg-current opacity-40" />
          <div className="h-2 w-28 rounded bg-current opacity-30" />
        </div>
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      onError={() => setImgError(true)}
      className={`block object-contain transition-opacity duration-300 ${className}`}
    />
  );
}
