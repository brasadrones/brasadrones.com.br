import React, { useEffect, useRef, useState } from 'react';
import BrasaDroneIcon from './BrasaDroneIcon';

interface NarrativeTimelineProps {
  activeSection: string;
}

export default function NarrativeTimeline({ activeSection }: NarrativeTimelineProps) {
  const [visible, setVisible] = useState(false);
  const droneRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateTimeline = () => {
      const origemEl = document.getElementById('origem');
      const doraEl = document.getElementById('dora');
      const brasaEl = document.getElementById('brasa');
      const equipeEl = document.getElementById('equipe');

      if (!origemEl || !doraEl || !brasaEl) {
        setVisible(false);
        return;
      }

      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Section positions relative to document top
      const origemTop = origemEl.getBoundingClientRect().top + scrollY;
      const doraTop = doraEl.getBoundingClientRect().top + scrollY;
      const brasaTop = brasaEl.getBoundingClientRect().top + scrollY;
      const equipeTop = equipeEl ? equipeEl.getBoundingClientRect().top + scrollY : brasaTop + brasaEl.offsetHeight;

      // Timeline is active from when origem starts entering viewport until equipe starts entering
      const startTrigger = origemTop - windowHeight * 0.4;
      const endTrigger = equipeTop - windowHeight * 0.4;

      const isTimelineActive = scrollY >= startTrigger && scrollY < endTrigger;
      setVisible(isTimelineActive);

      if (!isTimelineActive || !droneRef.current || !trackRef.current) return;

      // Track height available for drone movement
      const trackHeight = trackRef.current.clientHeight;

      // Calculate progress t from 0 to 1 across (origem -> dora -> brasa)
      let progress = 0;
      if (scrollY < origemTop) {
        progress = 0;
      } else if (scrollY < doraTop) {
        const range = doraTop - origemTop;
        progress = range > 0 ? (0.5 * (scrollY - origemTop)) / range : 0;
      } else if (scrollY < brasaTop) {
        const range = brasaTop - doraTop;
        progress = range > 0 ? 0.5 + (0.5 * (scrollY - doraTop)) / range : 0.5;
      } else {
        const range = equipeTop - brasaTop;
        const subProgress = range > 0 ? Math.min(1, (scrollY - brasaTop) / range) : 1;
        progress = 0.95 + 0.05 * subProgress;
      }

      progress = Math.max(0, Math.min(1, progress));

      const droneY = progress * trackHeight;

      if (prefersReducedMotion) {
        droneRef.current.style.transform = `translateY(${droneY}px)`;
      } else {
        droneRef.current.style.transform = `translateY(${droneY}px)`;
      }
    };

    const onScrollOrResize = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        updateTimeline();
        rafIdRef.current = null;
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    updateTimeline();

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Contextual color themes
  const isBrasa = activeSection === 'brasa';
  const isDora = activeSection === 'dora';
  const isOrigem = activeSection === 'origem';

  // Base line & label styles
  const lineBg = isBrasa
    ? 'bg-[#071A4D]/30'
    : isOrigem
    ? 'bg-[#FFFAF4]/35'
    : 'bg-[#FFFAF4]/20';

  const textColor = isBrasa
    ? 'text-[#071A4D]/70'
    : isOrigem
    ? 'text-[#FFFAF4]/70 [text-shadow:0_1px_3px_rgba(0,0,0,0.85)]'
    : 'text-[#FFFAF4]/60';

  // Active milestone colors
  const origemActiveColor = isOrigem
    ? 'text-[#FFFAF4] font-semibold opacity-100 [text-shadow:0_1px_4px_rgba(7,26,77,0.95),0_0_8px_rgba(0,0,0,0.95)]'
    : '';
  const doraActiveColor = isDora
    ? 'text-[#F4879F] font-semibold opacity-100'
    : '';
  const brasaActiveColor = isBrasa
    ? 'text-[#FB9627] font-semibold opacity-100'
    : '';

  // Drone color
  const droneColor = isBrasa
    ? '#FB9627'
    : isDora
    ? '#F4879F'
    : '#FB9627';

  return (
    <aside
      aria-hidden="true"
      className={`fixed left-2 sm:left-3 md:left-4 lg:left-6 xl:left-8 top-[calc(50dvh+48px)] sm:top-[calc(50dvh+56px)] lg:top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-start transition-all duration-350 ease-out w-[28px] sm:w-auto overflow-visible motion-reduce:transition-opacity motion-reduce:duration-150 ${
        visible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-[3px] motion-reduce:translate-x-0'
      }`}
    >
      <div className="relative flex items-center gap-1 sm:gap-2 md:gap-3">
        {/* Track Line Container */}
        <div
          ref={trackRef}
          className={`relative w-[1.5px] lg:w-[2px] h-[40dvh] max-h-[210px] min-h-[150px] lg:min-h-0 lg:max-h-none lg:h-52 ${lineBg} transition-colors duration-300 rounded-full shrink-0`}
        >
          {/* Moving Drone Indicator */}
          <div
            ref={droneRef}
            className="absolute -left-[7px] -top-[8px] lg:-left-[13px] lg:-top-[14px] will-change-transform transition-colors duration-300"
          >
            <BrasaDroneIcon
              color={droneColor}
              className="w-4 h-4 lg:w-7 lg:h-7"
            />
          </div>
        </div>

        {/* Milestone Labels Track */}
        <div
          className={`h-[40dvh] max-h-[210px] min-h-[150px] lg:min-h-0 lg:max-h-none lg:h-52 flex flex-col justify-between text-[8px] sm:text-[9.5px] md:text-[10px] lg:text-[11px] font-dora-display tracking-wider uppercase transition-colors duration-300 ${textColor} shrink-0`}
        >
          <span
            className={`inline-block whitespace-nowrap [writing-mode:vertical-rl] rotate-180 transition-all duration-300 ${origemActiveColor}`}
          >
            Origem
          </span>
          <span
            className={`inline-block whitespace-nowrap [writing-mode:vertical-rl] rotate-180 transition-all duration-300 ${doraActiveColor}`}
          >
            Projeto Dora
          </span>
          <span
            className={`inline-block whitespace-nowrap [writing-mode:vertical-rl] rotate-180 transition-all duration-300 ${brasaActiveColor}`}
          >
            BRASA
          </span>
        </div>
      </div>
    </aside>
  );
}
