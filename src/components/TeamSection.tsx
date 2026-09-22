import { useState, useEffect, useRef } from 'react';
import { siteContent } from '../content/siteContent';

export default function TeamSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Detect reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    if (motionQuery.matches) {
      setIsRevealed(true);
      return;
    }

    // IntersectionObserver for single entry reveal animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const founders = siteContent.team.founders;

  // Sort members alphabetically by first name for vertical stack, retaining original index for desktop positioning
  const sortedFounders = founders
    .map((member, originalIdx) => ({ member, originalIdx }))
    .sort((a, b) => a.member.name.localeCompare(b.member.name, 'pt-BR'));

  // Specific object positions for natural framing
  const founderObjectPositions = [
    'object-[center_20%]',
    'object-center',
    'object-center',
  ];

  return (
    <section
      id="equipe"
      ref={sectionRef}
      className="scroll-mt-[88px] sm:scroll-mt-[108px] lg:scroll-mt-[120px] pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-20 px-5 sm:px-8 md:px-12 bg-[#071A4D] text-[#FFFAF4] border-t border-[#FFFAF4]/10 relative isolate overflow-hidden"
    >
      <div className="max-w-[78rem] mx-auto relative z-10">
        {/* Section Header */}
        <div>
          <h2 className="font-brasa-display font-semibold text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] text-[#FFFAF4] tracking-tight leading-none mb-8 sm:mb-10 md:mb-12">
            {siteContent.team.label}
          </h2>
        </div>

        {/* Founders Block (Restricted Max Width 78rem) */}
        <div className="space-y-8 max-w-[78rem] mx-auto w-full">
          <div className="flex items-center gap-4">
            <h3 className="text-xs sm:text-sm font-brasa-body font-medium uppercase tracking-widest text-[#8B99B5] shrink-0">
              {siteContent.team.foundersLabel}
            </h3>
            <div className="h-px bg-[#FFFAF4]/10 flex-1" />
          </div>

          {/* Founders Grid Container with Background Continuous BRASA Geometry */}
          <div className="relative">
            {/* Single Continuous Aerodynamic BRASA Geometry Line (Behind Portraits z-0) */}
            <div
              className="absolute inset-0 -mx-12 sm:-mx-20 -my-8 pointer-events-none z-0 overflow-hidden"
              style={{
                clipPath: reducedMotion || isRevealed ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                transition: reducedMotion ? 'none' : 'clip-path 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <svg
                className="w-full h-full min-h-[350px]"
                viewBox="0 0 1200 500"
                preserveAspectRatio="none"
                fill="none"
              >
                {/* Secondary chromatic layer (#FB9627 opacity 0.05) */}
                <path
                  d="M -100,250 C 250,50 550,450 850,150 C 1050,0 1200,250 1350,250"
                  stroke="#FB9627"
                  strokeWidth="110"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.05"
                  transform="translate(6, 4)"
                />
                {/* Primary aerodynamic flow layer (#02AACA opacity 0.14) */}
                <path
                  d="M -100,250 C 250,50 550,450 850,150 C 1050,0 1200,250 1350,250"
                  stroke="#02AACA"
                  strokeWidth="110"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.14"
                />
              </svg>
            </div>

            {/* 3 Founders: 6-column Grid (z-10) */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-y-8 gap-x-4 md:gap-8 lg:gap-10 items-start relative z-10">
              {sortedFounders.map(({ member, originalIdx }) => (
                <div
                  key={member.id}
                  className="md:col-span-2 w-full max-w-[16rem] sm:max-w-[18rem] md:max-w-none mx-auto space-y-3 sm:space-y-4 group"
                >
                  {/* Photo Frame - Identical 4:5 aspect ratio */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden border border-[#FFFAF4]/15 bg-[#030C27] rounded-xs">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className={`w-full h-full object-cover ${founderObjectPositions[originalIdx]} group-hover:scale-[1.02] transition-transform duration-700`}
                    />
                  </div>

                  {/* Identification */}
                  <div className="space-y-1 pt-1">
                    <span className="text-xs font-brasa-body-bold text-[#FB9627] uppercase tracking-widest block">
                      {member.role}
                    </span>
                    <h4 className="text-lg sm:text-xl font-brasa-display text-[#FFFAF4]">
                      {member.name}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

