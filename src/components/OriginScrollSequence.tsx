import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from '../content/siteContent';

gsap.registerPlugin(ScrollTrigger);

const POSTER_IMAGE = '/media/brasa/brasa-origin-poli-poster.jpg';

export default function OriginScrollSequence() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Simple, subtle entrance animation for the text content
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const textEl = container.querySelector('.origin-text-content');
      if (!textEl) return;

      gsap.fromTo(
        textEl,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="origem"
      ref={containerRef}
      className="scroll-mt-[88px] sm:scroll-mt-[108px] lg:scroll-mt-[120px] relative w-full min-h-[85vh] lg:min-h-screen flex items-center justify-center bg-[#071A4D] select-none isolate overflow-hidden py-12 sm:py-16 md:py-20 lg:py-0"
    >
      {/* FULL-BLEED BACKGROUND PHOTOGRAPHY */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <img
          src={POSTER_IMAGE}
          alt={siteContent.origin.imageAlt}
          className="w-full h-full object-cover object-[45%_center] md:object-[40%_center] lg:object-[50%_center]"
          style={{
            transform: 'scale(1.03)',
          }}
        />

        {/* Localized shading for text legibility (Mobile & Tablet) */}
        <div className="lg:hidden absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(7,26,77,0.35)_15%,rgba(7,26,77,0.92)_85%)] pointer-events-none" />
        <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-[#071A4D] via-transparent to-[#071A4D]/70 pointer-events-none" />

        {/* Localized radial gradient behind centered text (Desktop lg+) */}
        <div
          className="hidden lg:block absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(7,26,77,0.78) 0%, rgba(7,26,77,0.55) 25%, rgba(7,26,77,0.22) 48%, rgba(7,26,77,0) 72%)',
          }}
        />

        {/* Fine grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* SINGLE NARRATIVE MOMENT */}
      <div className="relative z-10 max-w-[100rem] mx-auto w-full pl-[46px] sm:pl-14 md:pl-20 lg:pl-16 pr-5 sm:pr-8 md:pr-12">
        <div className="origin-text-content max-w-2xl lg:max-w-[44rem] xl:max-w-[48rem] mx-auto space-y-4 sm:space-y-6 text-left lg:text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] xl:text-[3.4rem] font-brasa-display text-[#FFFAF4] tracking-tight leading-tight">
            {siteContent.origin.title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-[1.125rem] xl:text-[1.225rem] text-[#FFFAF4]/90 font-brasa-body leading-relaxed">
            {siteContent.origin.body}
          </p>
        </div>
      </div>
    </section>
  );
}

