import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from '../content/siteContent';

gsap.registerPlugin(ScrollTrigger);

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const motifRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const motif = motifRef.current;
    if (!section || !motif) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        // Single dominant animation: the BRASA motif opens smoothly as section enters
        gsap.fromTo(
          motif,
          {
            scale: 0.8,
            rotation: -12,
            opacity: 0,
          },
          {
            scale: 1,
            rotation: 0,
            opacity: 0.16,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Gentle text reveal
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      } else {
        gsap.set(motif, { opacity: 0.16, scale: 1, rotation: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="brasa"
      ref={sectionRef}
      className="scroll-mt-[88px] sm:scroll-mt-[108px] lg:scroll-mt-[120px] pt-8 sm:pt-12 md:pt-14 lg:pt-16 pb-8 sm:pb-10 md:pb-12 pl-[46px] sm:pl-14 md:pl-20 lg:pl-28 xl:pl-32 pr-5 sm:pr-8 md:pr-12 bg-[#FFFAF4] text-[#071A4D] relative isolate overflow-hidden select-none"
    >
      {/* SINGLE DOMINANT MONUMENTAL ABSTRACT BRASA MOTIF (Radial movement, wing sweep, aerodynamic flow, propeller rhythm) */}
      <div
        ref={motifRef}
        className="absolute -right-20 sm:-right-10 top-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] md:w-[950px] lg:w-[1150px] h-[550px] sm:h-[750px] md:h-[950px] lg:h-[1150px] pointer-events-none opacity-0 z-0 origin-center flex items-center justify-center overflow-visible"
      >
        <svg
          className="w-full h-full text-[#071A4D]"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer aerodynamic wing sweep arcs */}
          <path
            d="M 120 700 C 280 420, 520 220, 750 100"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 170 730 C 330 460, 560 270, 770 160"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="12 12"
          />
          <path
            d="M 220 760 C 380 500, 600 320, 790 220"
            stroke="#FB9627"
            strokeWidth="2"
            strokeOpacity="0.85"
          />

          {/* Radial propeller rhythm concentric sweep curves */}
          <path
            d="M 400 400 A 300 300 0 0 1 700 400"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 8"
          />
          <path
            d="M 400 400 A 220 220 0 0 1 620 400"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M 400 400 A 140 140 0 0 1 540 400"
            stroke="currentColor"
            strokeWidth="2"
          />

          {/* Sweeping fluid diagonal ray lines */}
          <line x1="400" y1="400" x2="720" y2="180" stroke="currentColor" strokeWidth="1.5" />
          <line x1="400" y1="400" x2="760" y2="300" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="400" y1="400" x2="680" y2="520" stroke="#FB9627" strokeWidth="1.5" strokeOpacity="0.7" />
        </svg>
      </div>

      <div className="max-w-[95rem] mx-auto space-y-6 sm:space-y-8 md:space-y-10 relative z-10">
        {/* Monumental Editorial Headline */}
        <div className="max-w-5xl">
          <h2
            ref={headlineRef}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-brasa-display tracking-tight text-[#071A4D] leading-[0.98]"
          >
            {siteContent.brasa.titleLine1}{' '}
            <span className="font-brasa-display text-[#FB9627] block sm:inline mt-2 sm:mt-0">
              {siteContent.brasa.titleHighlight}
            </span>
          </h2>
        </div>

        {/* Asymmetrical Editorial Text Blocks (Spacious & Open, No Cards or Feature Grids) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 text-base sm:text-xl md:text-2xl font-brasa-body leading-relaxed text-[#071A4D]/90 pt-6 sm:pt-8 border-t border-[#071A4D]/15 text-justify">
          <div className="lg:col-span-7">
            <p className="text-justify">
              {siteContent.brasa.bodyCol1}
            </p>
          </div>

          <div className="lg:col-span-5 space-y-3.5 sm:space-y-4 text-base sm:text-lg md:text-xl text-[#071A4D]/80">
            <p className="text-justify">
              {siteContent.brasa.bodyCol2}
            </p>
            <p className="text-justify">
              {siteContent.brasa.bodyCol3}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
