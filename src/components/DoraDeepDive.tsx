import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from '../content/siteContent';

gsap.registerPlugin(ScrollTrigger);

export default function DoraDeepDive() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<SVGSVGElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const insightRefs = useRef<Array<HTMLDivElement | null>>([]);
  const currentInsightRef = useRef<number>(0);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const carouselOffset = carousel.offsetLeft;

      let minDistance = Infinity;
      let closestIndex = currentInsightRef.current;

      insightRefs.current.forEach((el, idx) => {
        if (!el) return;
        const targetLeft = el.offsetLeft - carouselOffset;
        const distance = Math.abs(scrollLeft - targetLeft);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });

      currentInsightRef.current = closestIndex;
    };

    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNextSlide = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const insights = siteContent.dora.insights;
    if (!insights || !insights.length) return;

    const nextIndex = (currentInsightRef.current + 1) % insights.length;
    const targetElement = insightRefs.current[nextIndex];

    if (!targetElement) return;

    const targetLeft = targetElement.offsetLeft - carousel.offsetLeft;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startScrollLeft = carousel.scrollLeft;

    carousel.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    if (carousel.scrollLeft === startScrollLeft && targetLeft !== startScrollLeft) {
      carousel.scrollLeft = targetLeft;
    }

    currentInsightRef.current = nextIndex;
  };

  const handlePreviousSlide = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const insights = siteContent.dora.insights;
    if (!insights || !insights.length) return;

    const prevIndex = (currentInsightRef.current - 1 + insights.length) % insights.length;
    const targetElement = insightRefs.current[prevIndex];

    if (!targetElement) return;

    const targetLeft = targetElement.offsetLeft - carousel.offsetLeft;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const startScrollLeft = carousel.scrollLeft;

    carousel.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });

    if (carousel.scrollLeft === startScrollLeft && targetLeft !== startScrollLeft) {
      carousel.scrollLeft = targetLeft;
    }

    currentInsightRef.current = prevIndex;
  };

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();

      // Angular geometric frame animation
      gsap.fromTo(
        frame,
        { scale: 1.15, opacity: 0.2 },
        {
          scale: 1,
          opacity: 0.65,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.5,
          },
        }
      );

      // Text reveal for header and intro content
      gsap.fromTo(
        '.dora-content-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
          },
        }
      );

      // Mobile / Tablet (< xl): Carousel entrance animation
      mm.add('(max-width: 1279px)', () => {
        gsap.fromTo(
          '.dora-carousel-container',
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.dora-carousel-container',
              start: 'top 85%',
            },
          }
        );
      });

      // Desktop (xl+): Editorial insights individual reveal animation
      mm.add('(min-width: 1280px)', () => {
        gsap.fromTo(
          '.dora-insight-reveal',
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.dora-insight-reveal',
              start: 'top 80%',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="dora"
      ref={sectionRef}
      className="scroll-mt-[88px] sm:scroll-mt-[108px] lg:scroll-mt-[120px] relative z-10 isolate py-8 sm:py-12 md:py-14 lg:py-16 pl-[46px] sm:pl-14 md:pl-20 lg:pl-20 pr-5 sm:pr-8 md:pr-12 bg-[#0F0F0F] text-[#FFFAF4] select-none"
    >
      {/* ABSTRACT ANGULAR GEOMETRIC STRUCTURE (Dora Protective Frame Concept - Fine Lines, SVG) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 overflow-hidden">
        <svg
          ref={frameRef}
          className="w-[90vw] max-w-4xl h-auto text-[#0E0B57] stroke-[#F4879F]/40"
          viewBox="0 0 600 600"
          fill="none"
          strokeWidth="1.2"
        >
          {/* Protective Diamond Structure */}
          <polygon points="300,50 550,300 300,550 50,300" strokeDasharray="4 4" />
          <polygon points="300,100 500,300 300,500 100,300" strokeWidth="0.8" />
          <line x1="300" y1="50" x2="300" y2="550" strokeWidth="0.5" opacity="0.3" />
          <line x1="50" y1="300" x2="550" y2="300" strokeWidth="0.5" opacity="0.3" />

          {/* Precision Corner Anchors */}
          <circle cx="300" cy="50" r="3" fill="#F4879F" />
          <circle cx="550" cy="300" r="3" fill="#F4879F" />
          <circle cx="300" cy="550" r="3" fill="#F4879F" />
          <circle cx="50" cy="300" r="3" fill="#F4879F" />
        </svg>
      </div>

      {/* CONCENTRATED SOLID COLOR FIELD CONTENT */}
      <div className="max-w-[80rem] mx-auto space-y-7 sm:space-y-9 md:space-y-10 lg:space-y-12 relative z-10">
        {/* Integrated Opening Composition (Intro -> Headline) */}
        <div className="dora-content-reveal max-w-4xl space-y-3.5 sm:space-y-4">
          {(() => {
            const fullText = siteContent.dora.introText;
            const target = 'Projeto Dora';
            const index = fullText.indexOf(target);
            if (index !== -1) {
              const before = fullText.slice(0, index);
              const after = fullText.slice(index + target.length);
              return (
                <p className="text-[1.05rem] sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.35rem] xl:text-[1.4rem] text-[#FFFAF4]/90 font-dora-body leading-[1.5] md:leading-snug max-w-full md:max-w-[48ch]">
                  {before}
                  <span className="font-dora-display text-[#F4879F] font-semibold">{target}</span>
                  {after}
                </p>
              );
            }
            return (
              <p className="text-[1.05rem] sm:text-[1.125rem] md:text-[1.25rem] lg:text-[1.35rem] xl:text-[1.4rem] text-[#FFFAF4]/90 font-dora-body leading-[1.5] md:leading-snug max-w-full md:max-w-[48ch]">
                {fullText}
              </p>
            );
          })()}

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-5xl font-dora-display tracking-tight text-[#FFFAF4] leading-[1.08]">
            {siteContent.dora.titleLine1}
            <span className="text-[#F4879F]">
              {siteContent.dora.titleHighlight}
            </span>
          </h2>
        </div>

        {/* Asymmetrical Editorial Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 md:gap-10 items-start pt-4 sm:pt-5 border-t border-[#FFFAF4]/10">
          <div className="dora-content-reveal lg:col-span-6 space-y-2.5 sm:space-y-3">
            <h3 className="text-xl sm:text-2xl font-dora-display text-[#FFFAF4]">
              {siteContent.dora.subtitle}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-[#FFFAF4]/85 font-dora-body leading-relaxed">
              {siteContent.dora.bodyCol1}
            </p>
          </div>

          <div className="dora-content-reveal lg:col-span-6">
            <div className="p-4 sm:p-6 md:p-7 bg-[#F4879F] text-[#0F0F0F] rounded-sm">
              <p className="font-dora-display font-medium md:font-semibold text-base sm:text-lg md:text-xl leading-snug text-[#0F0F0F]">
                {siteContent.dora.bodyCol2}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Editorial Insights */}
        {siteContent.dora.insights && (
          <div>
            {/* Mobile / Tablet (< xl): Native Horizontal Scroll Carousel */}
            <div
              ref={carouselRef}
              className="xl:hidden dora-carousel-container flex flex-nowrap items-stretch overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-smooth overscroll-x-contain gap-5 sm:gap-6 md:gap-8 px-1 pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {siteContent.dora.insights.map((insight, idx) => (
                <div
                  key={idx}
                  ref={(el) => {
                    insightRefs.current[idx] = el;
                  }}
                  className="w-full flex-[0_0_100%] shrink-0 self-stretch snap-start h-full space-y-2.5 border-t border-[#F4879F] pt-3.5 sm:pt-4 bg-transparent transition-all duration-300 ease-out xl:transition-none"
                >
                  <h4 className="text-lg sm:text-xl font-dora-display font-semibold text-[#FFFAF4]">
                    {insight.title}
                  </h4>
                  <p className="text-sm sm:text-base text-[#FFFAF4]/85 font-dora-body leading-relaxed whitespace-pre-line text-justify [text-justify:inter-word]">
                    {insight.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Two Arrow Navigation Controls (< xl) */}
            <div className="xl:hidden flex justify-end items-center gap-1 mt-0">
              <button
                type="button"
                aria-label="Voltar conteúdo do Projeto Dora"
                onClick={handlePreviousSlide}
                className="p-1 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#F4879F] opacity-50 hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200 bg-transparent border-0 outline-none cursor-pointer"
              >
                <ChevronLeft className="w-8 h-8" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                aria-label="Avançar conteúdo do Projeto Dora"
                onClick={handleNextSlide}
                className="p-1 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#F4879F] opacity-50 hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200 bg-transparent border-0 outline-none cursor-pointer"
              >
                <ChevronRight className="w-8 h-8" strokeWidth={1.75} />
              </button>
            </div>

            {/* Desktop (xl+): Aligned 12-column Grid for 3 items */}
            <div className="hidden xl:grid grid-cols-12 gap-8 items-start">
              {siteContent.dora.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="dora-insight-reveal col-span-4 space-y-2.5 border-t border-[#F4879F] pt-4 bg-transparent"
                >
                  <h4 className="text-lg sm:text-xl font-dora-display font-semibold text-[#FFFAF4]">
                    {insight.title}
                  </h4>
                  <p className="text-sm sm:text-base text-[#FFFAF4]/85 font-dora-body leading-relaxed whitespace-pre-line">
                    {insight.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locais que Aderiram ao Projeto Dora */}
        {'locations' in siteContent.dora && siteContent.dora.locations && (
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-dora-display uppercase tracking-widest text-[#FFFAF4]/90">
                {siteContent.dora.locations.title}
              </h3>
              <div className="h-[1px] w-full bg-[#F4879F]" aria-hidden="true" />
            </div>

            <div className="pt-1 space-y-3">
              {siteContent.dora.locations.items.map((loc, idx) => (
                <div key={idx} className="group flex flex-col items-start space-y-1">
                  {loc.hidden ? (
                    <div className="flex flex-col items-start py-0.5">
                      <div className="relative inline-flex items-center justify-center py-0.5 group" aria-hidden="true">
                        <svg
                          className="h-7 sm:h-8 w-44 sm:w-52 text-[#F4879F] transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                          viewBox="0 0 210 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="16" cy="16" r="12" fill="#F4879F" fillOpacity="0.85" />
                          <circle cx="28" cy="14" r="14" fill="#F4879F" fillOpacity="0.95" />
                          <circle cx="42" cy="18" r="11" fill="#FFFAF4" fillOpacity="0.75" />
                          <circle cx="54" cy="15" r="13" fill="#F4879F" fillOpacity="0.9" />
                          <circle cx="68" cy="17" r="10" fill="#F4879F" fillOpacity="0.8" />
                          <circle cx="82" cy="13" r="14" fill="#F4879F" fillOpacity="0.95" />
                          <circle cx="96" cy="17" r="12" fill="#FFFAF4" fillOpacity="0.7" />
                          <circle cx="110" cy="14" r="13" fill="#F4879F" fillOpacity="0.9" />
                          <circle cx="124" cy="18" r="11" fill="#F4879F" fillOpacity="0.8" />
                          <circle cx="138" cy="14" r="13" fill="#F4879F" fillOpacity="0.95" />
                          <circle cx="152" cy="16" r="11" fill="#FFFAF4" fillOpacity="0.65" />
                          <circle cx="165" cy="15" r="12" fill="#F4879F" fillOpacity="0.85" />
                          <circle cx="178" cy="17" r="10" fill="#F4879F" fillOpacity="0.75" />
                          <circle cx="190" cy="16" r="8" fill="#F4879F" fillOpacity="0.6" />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-[11px] font-dora-display uppercase tracking-widest text-[#0F0F0F] font-bold z-10 pointer-events-none select-none">
                          EM BREVE
                        </span>
                      </div>
                      <span className="sr-only">Local do Projeto Dora. Anúncio em breve.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start space-y-1">
                      {loc.status && loc.status.toLowerCase() !== 'em breve' && (
                        <span className="text-xs sm:text-sm font-dora-display uppercase tracking-widest text-[#F4879F]">
                          {loc.status}
                        </span>
                      )}
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <svg
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F4879F] shrink-0 fill-current"
                          viewBox="0 0 12 12"
                          aria-hidden="true"
                        >
                          <path d="M6 0L12 6L6 12L0 6Z" />
                        </svg>
                        <span className="text-base sm:text-lg font-dora-display text-[#FFFAF4] font-medium">
                          {loc.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Institutional Partnership Signature */}
        {siteContent.dora.partnership && (
          <div className="pt-4 sm:pt-5 border-t border-[#F4879F] max-w-3xl bg-transparent">
            <p className="text-lg sm:text-xl lg:text-2xl font-dora-display font-semibold text-[#FFFAF4] leading-snug">
              {siteContent.dora.partnership}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

