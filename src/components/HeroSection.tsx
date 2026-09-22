import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { siteContent } from '../content/siteContent';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onExplore: () => void;
}

export default function HeroSection({ onExplore }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Entrance animation refs
  const headlineLine1Ref = useRef<HTMLDivElement | null>(null);
  const headlineLine2Ref = useRef<HTMLDivElement | null>(null);
  const headlineLine3Ref = useRef<HTMLDivElement | null>(null);
  const scrollCueRef = useRef<HTMLDivElement | null>(null);

  // States for capability detection
  const [isInteractive, setIsInteractive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Synchronized refs to avoid stale closure issues in RAF & observers
  const reducedMotionRef = useRef<boolean>(false);
  const isInteractiveRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(false);

  // Pointer position storage ref (persists across scroll/visibility changes without triggering re-renders)
  const pointerRef = useRef({
    clientX: 0,
    clientY: 0,
    hasValue: false,
  });

  // Initialization ref for intro flight trajectory (ensures intro flight runs exactly once)
  const hasInitializedFlightRef = useRef(false);

  // Autonomous Motion Mode refs for Desktop Fine Pointer
  const motionModeRef = useRef<'intro' | 'pointer' | 'idle-sine'>('intro');
  const idleTimeoutRef = useRef<number | null>(null);
  const idleSineTRef = useRef<number>(0); // Parameter t in [0, 1]
  const idleSineDirRef = useRef<number>(1); // Direction: +1 or -1
  const lastFrameTimeRef = useRef<number>(0);

  // Canvas loop state stored in refs (Zero React state updates inside RAF)
  const animFrameIdRef = useRef<number | null>(null);
  const startRAFRef = useRef<(() => void) | null>(null);
  const stopRAFRef = useRef<(() => void) | null>(null);
  const drawStaticFrameRef = useRef<(() => void) | null>(null);

  // Drone position & movement state
  const droneStateRef = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    prevX: 0,
    prevY: 0,
    tilt: 0,
    targetTilt: 0,
  });

  // Autonomous intro flight state (1.5s - 2.5s trajectory)
  const introFlightRef = useRef({
    active: false,
    startTime: 0,
    duration: 2200, // 2.2s flight
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    finished: false,
  });

  // Grid node matrix ref
  const nodesRef = useRef<
    Array<{
      bx: number; // Base default resting X
      by: number; // Base default resting Y
      x: number;  // Current X
      y: number;  // Current Y
      colsIndex: number;
      rowsIndex: number;
    }>
  >([]);
  const gridDimensionsRef = useRef({ cols: 0, rows: 0, width: 0, height: 0 });

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
    if (reducedMotion) {
      stopRAFRef.current?.();
      drawStaticFrameRef.current?.();
    }
  }, [reducedMotion]);

  useEffect(() => {
    isInteractiveRef.current = isInteractive;
  }, [isInteractive]);

  // 1. Capability Detection
  useEffect(() => {
    const finePointerMatch = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotionMatch = window.matchMedia('(prefers-reduced-motion: reduce)');

    const interactive = finePointerMatch.matches && !reducedMotionMatch.matches;
    const reduced = reducedMotionMatch.matches;

    setIsInteractive(interactive);
    setReducedMotion(reduced);
    isInteractiveRef.current = interactive;
    reducedMotionRef.current = reduced;

    const handleFinePointerChange = (e: MediaQueryListEvent) => {
      const isInt = e.matches && !reducedMotionRef.current;
      setIsInteractive(isInt);
      isInteractiveRef.current = isInt;
    };
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      const isRed = e.matches;
      setReducedMotion(isRed);
      reducedMotionRef.current = isRed;
      const isInt = finePointerMatch.matches && !isRed;
      setIsInteractive(isInt);
      isInteractiveRef.current = isInt;
    };

    finePointerMatch.addEventListener('change', handleFinePointerChange);
    reducedMotionMatch.addEventListener('change', handleReducedMotionChange);

    return () => {
      finePointerMatch.removeEventListener('change', handleFinePointerChange);
      reducedMotionMatch.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  // 3. Drone-Induced Reveal & Subtle Settle (Text visible from Frame 1)
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        [headlineLine1Ref.current, headlineLine2Ref.current, headlineLine3Ref.current, scrollCueRef.current],
        { opacity: 0.92 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // 3b. Hero -> Origin Scroll Transition (No Pin)
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to([headlineLine1Ref.current, headlineLine2Ref.current, headlineLine3Ref.current], {
        y: '-10vh',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(canvasRef.current, {
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(scrollCueRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '30% top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // 4. Interactive Topography & Drone Canvas Engine (High Performance Lifecycle)
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 120 uniform samples closest point algorithm for smooth sine-wave entry
    const findClosestSineT = (droneX: number, droneY: number, width: number, height: number): number => {
      let minDistanceSq = Infinity;
      let bestT = 0;
      const samples = 120;
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const sampleY = height * (0.10 + 0.80 * t);
        const sampleX = width * (0.75 + 0.15 * Math.sin(2 * Math.PI * t));
        const dx = sampleX - droneX;
        const dy = sampleY - droneY;
        const distSq = dx * dx + dy * dy;
        if (distSq < minDistanceSq) {
          minDistanceSq = distSq;
          bestT = t;
        }
      }
      return bestT;
    };

    const clearIdleTimeout = () => {
      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = null;
      }
    };

    const scheduleIdleSineTimeout = () => {
      clearIdleTimeout();
      idleTimeoutRef.current = window.setTimeout(() => {
        if (
          isInteractiveRef.current &&
          !reducedMotionRef.current &&
          introFlightRef.current.finished &&
          isVisibleRef.current
        ) {
          motionModeRef.current = 'idle-sine';

          const { width, height } = gridDimensionsRef.current;
          if (width > 0 && height > 0) {
            const drone = droneStateRef.current;
            const bestT = findClosestSineT(drone.x, drone.y, width, height);
            idleSineTRef.current = bestT;
          }

          lastFrameTimeRef.current = performance.now();
          if (startRAFRef.current) startRAFRef.current();
        }
      }, 5000);
    };

    // Draw single frame & report whether motion/deformation is actively ongoing
    const drawFrame = (): boolean => {
      const { width, height, cols } = gridDimensionsRef.current;
      if (width === 0 || height === 0) return false;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const drone = droneStateRef.current;
      const now = performance.now();
      const intro = introFlightRef.current;

      let hasDroneMotion = false;

      // Position & Motion handling (Intro flight vs Autonomous idle-sine vs Desktop cursor control vs Touch resting)
      if (!intro.finished && intro.active) {
        motionModeRef.current = 'intro';
        hasDroneMotion = true;
        const elapsed = now - intro.startTime;
        const progress = Math.min(1, elapsed / intro.duration);

        const easeProgress =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentX = intro.startX + (intro.endX - intro.startX) * easeProgress;
        const arcLift = Math.sin(progress * Math.PI) * (height * 0.08);
        const currentY = intro.startY + (intro.endY - intro.startY) * easeProgress - arcLift;

        drone.targetX = currentX;
        drone.targetY = currentY;

        drone.x += (drone.targetX - drone.x) * 0.2;
        drone.y += (drone.targetY - drone.y) * 0.2;

        const vx = drone.x - drone.prevX;
        const vy = drone.y - drone.prevY;
        const speed = Math.hypot(vx, vy);

        if (speed > 0.1) {
          const angle = Math.atan2(vy, vx);
          const maxTilt = 0.09;
          drone.targetTilt = Math.max(-maxTilt, Math.min(maxTilt, Math.sin(angle)));
        } else {
          drone.targetTilt = 0;
        }

        drone.tilt += (drone.targetTilt - drone.tilt) * 0.15;
        drone.prevX = drone.x;
        drone.prevY = drone.y;

        if (progress >= 1) {
          intro.finished = true;
          intro.active = false;
          drone.targetX = intro.endX;
          drone.targetY = intro.endY;

          if (pointerRef.current.hasValue && sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            drone.targetX = pointerRef.current.clientX - rect.left;
            drone.targetY = pointerRef.current.clientY - rect.top;
          }

          if (isInteractiveRef.current) {
            motionModeRef.current = 'pointer';
            scheduleIdleSineTimeout();
          }
        }
      } else if (isInteractiveRef.current && intro.finished && motionModeRef.current === 'idle-sine') {
        // Autonomous Sine-Wave Trajectory Mode
        const dt = lastFrameTimeRef.current ? Math.min(now - lastFrameTimeRef.current, 100) : 16;
        lastFrameTimeRef.current = now;

        // Traversal duration: 9000ms (9s) for full top <-> bottom pass
        const step = (dt / 9000) * idleSineDirRef.current;
        idleSineTRef.current += step;

        if (idleSineTRef.current >= 1) {
          idleSineTRef.current = 1;
          idleSineDirRef.current = -1;
        } else if (idleSineTRef.current <= 0) {
          idleSineTRef.current = 0;
          idleSineDirRef.current = 1;
        }

        const t = idleSineTRef.current;
        drone.targetY = height * (0.10 + 0.80 * t);
        drone.targetX = width * (0.75 + 0.15 * Math.sin(2 * Math.PI * t));

        const dx = drone.targetX - drone.x;
        const dy = drone.targetY - drone.y;

        drone.x += dx * 0.08;
        drone.y += dy * 0.08;

        const vx = drone.x - drone.prevX;
        const vy = drone.y - drone.prevY;
        const speed = Math.hypot(vx, vy);

        if (speed > 0.1) {
          const angle = Math.atan2(vy, vx);
          const maxTilt = 0.08;
          drone.targetTilt = Math.max(-maxTilt, Math.min(maxTilt, Math.sin(angle)));
        } else {
          drone.targetTilt = 0;
        }

        const dtilt = drone.targetTilt - drone.tilt;
        drone.tilt += dtilt * 0.1;
        drone.prevX = drone.x;
        drone.prevY = drone.y;

        hasDroneMotion = true;
      } else if (isInteractiveRef.current && intro.finished && motionModeRef.current === 'pointer') {
        // Desktop Pointer Following Mode
        const dx = drone.targetX - drone.x;
        const dy = drone.targetY - drone.y;

        drone.x += dx * 0.08;
        drone.y += dy * 0.08;

        const vx = drone.x - drone.prevX;
        const vy = drone.y - drone.prevY;
        const speed = Math.hypot(vx, vy);

        if (speed > 0.1) {
          const angle = Math.atan2(vy, vx);
          const maxTilt = 0.08;
          drone.targetTilt = Math.max(-maxTilt, Math.min(maxTilt, Math.sin(angle)));
        } else {
          drone.targetTilt = 0;
        }

        const dtilt = drone.targetTilt - drone.tilt;
        drone.tilt += dtilt * 0.1;
        drone.prevX = drone.x;
        drone.prevY = drone.y;

        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01 || Math.abs(dtilt) > 0.001) {
          hasDroneMotion = true;
        }
      } else {
        // Touch/Tablet/ReducedMotion resting state
        const dx = drone.targetX - drone.x;
        const dy = drone.targetY - drone.y;
        drone.x += dx * 0.1;
        drone.y += dy * 0.1;

        const dtilt = 0 - drone.tilt;
        drone.tilt += dtilt * 0.1;

        if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01 || Math.abs(dtilt) > 0.001) {
          hasDroneMotion = true;
        }
      }

      // Grid mesh node deformation field
      const influenceRadius = Math.min(width, height) * 0.24;
      const maxDisplace = 22;

      const nodes = nodesRef.current;
      let hasNodeMotion = false;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const dx = node.bx - drone.x;
        const dy = node.by - drone.y;
        const dist = Math.hypot(dx, dy);

        let targetX = node.bx;
        let targetY = node.by;

        if (dist < influenceRadius && dist > 0.001) {
          const factor = Math.pow(1 - dist / influenceRadius, 2);
          const push = factor * maxDisplace;
          const ux = dx / dist;
          const uy = dy / dist;

          targetX = node.bx + ux * push;
          targetY = node.by + uy * push;
        }

        const ndx = targetX - node.x;
        const ndy = targetY - node.y;

        node.x += ndx * 0.12;
        node.y += ndy * 0.12;

        if (Math.abs(ndx) > 0.01 || Math.abs(ndy) > 0.01) {
          hasNodeMotion = true;
        }
      }

      // Draw grid mesh lines
      ctx.lineWidth = 0.8;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const distToDrone = Math.hypot(node.x - drone.x, node.y - drone.y);

        const horizRatio = Math.min(1, Math.max(0, node.bx / width));
        const baseAlpha = 0.04 + horizRatio * 0.08;

        let alpha = baseAlpha;
        let strokeStyle = `rgba(255, 250, 244, ${baseAlpha.toFixed(3)})`;

        if (distToDrone < influenceRadius) {
          const inf = Math.pow(1 - distToDrone / influenceRadius, 2);
          alpha = baseAlpha + inf * 0.30;
          strokeStyle = `rgba(2, 170, 202, ${alpha.toFixed(3)})`;
        }

        const rightNeighbor = nodes[i + 1];
        if (rightNeighbor && rightNeighbor.rowsIndex === node.rowsIndex) {
          ctx.beginPath();
          ctx.strokeStyle = strokeStyle;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(rightNeighbor.x, rightNeighbor.y);
          ctx.stroke();
        }

        const bottomNeighbor = nodes[i + (cols + 2)];
        if (bottomNeighbor) {
          ctx.beginPath();
          ctx.strokeStyle = strokeStyle;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(bottomNeighbor.x, bottomNeighbor.y);
          ctx.stroke();
        }
      }

      // Draw grid nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const distToDrone = Math.hypot(node.x - drone.x, node.y - drone.y);

        const horizRatio = Math.min(1, Math.max(0, node.bx / width));
        let size = 1.5 + horizRatio * 0.8;
        let fillStyle = `rgba(255, 250, 244, ${(0.08 + horizRatio * 0.08).toFixed(3)})`;

        if (distToDrone < influenceRadius) {
          const inf = Math.pow(1 - distToDrone / influenceRadius, 2);
          size += inf * 1.8;
          fillStyle = `rgba(2, 170, 202, ${(0.15 + inf * 0.50).toFixed(3)})`;
        }

        ctx.fillStyle = fillStyle;
        ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size);
      }

      // Draw Official Geometric Drone Silhouette
      ctx.save();
      ctx.translate(drone.x, drone.y);
      ctx.rotate(drone.tilt);

      ctx.fillStyle = '#FFFAF4';
      ctx.strokeStyle = '#FFFAF4';

      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      const armLen = 15;
      const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

      ctx.lineWidth = 1.2;
      angles.forEach((ang) => {
        const rx = Math.cos(ang) * armLen;
        const ry = Math.sin(ang) * armLen;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(rx, ry);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rx, ry, 4, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.restore();
      ctx.restore();

      const hasMotion = !intro.finished || hasDroneMotion || hasNodeMotion;
      return hasMotion;
    };

    const stopRAF = () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };

    const render = () => {
      animFrameIdRef.current = null;

      if (!isVisibleRef.current || reducedMotionRef.current) {
        return;
      }

      const hasMotion = drawFrame();

      // Continue scheduling frames ONLY if there is actual pending drone movement or topography deformation
      if (hasMotion && isVisibleRef.current && !reducedMotionRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    const startRAF = () => {
      if (reducedMotionRef.current || !isVisibleRef.current) {
        return;
      }
      if (animFrameIdRef.current === null) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    const drawStaticFrame = () => {
      drawFrame();
    };

    stopRAFRef.current = stopRAF;
    startRAFRef.current = startRAF;
    drawStaticFrameRef.current = drawStaticFrame;

    // Build or recalculate grid matrix
    const rebuildGrid = () => {
      const width = section.clientWidth;
      const height = section.clientHeight;
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      let cols = 22;
      if (width < 640) cols = 11;
      else if (width < 1024) cols = 15;
      else if (width > 2000) cols = 26;

      const spacing = width / (cols + 1);
      const rows = Math.floor(height / spacing) + 1;

      gridDimensionsRef.current = { cols, rows, width, height };

      const nodes = [];
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols + 1; c++) {
          const bx = c * spacing;
          const by = r * spacing;
          nodes.push({
            bx,
            by,
            x: bx,
            y: by,
            colsIndex: c,
            rowsIndex: r,
          });
        }
      }
      nodesRef.current = nodes;

      const isDesktop = width >= 1024;
      const defaultX = isDesktop ? width * 0.78 : width * 0.70;
      const defaultY = height * 0.45;
      const startX = width * 0.20;
      const startY = height * 0.30;

      const isReduced = reducedMotionRef.current;

      if (!hasInitializedFlightRef.current) {
        hasInitializedFlightRef.current = true;

        introFlightRef.current = {
          active: !isReduced,
          startTime: performance.now(),
          duration: 2200,
          startX,
          startY,
          endX: defaultX,
          endY: defaultY,
          finished: isReduced,
        };

        if (isReduced) {
          droneStateRef.current.x = defaultX;
          droneStateRef.current.y = defaultY;
          droneStateRef.current.targetX = defaultX;
          droneStateRef.current.targetY = defaultY;
          droneStateRef.current.prevX = defaultX;
          droneStateRef.current.prevY = defaultY;
          droneStateRef.current.tilt = 0;
          droneStateRef.current.targetTilt = 0;
          drawStaticFrame();
        } else {
          droneStateRef.current.x = startX;
          droneStateRef.current.y = startY;
          droneStateRef.current.targetX = startX;
          droneStateRef.current.targetY = startY;
          droneStateRef.current.prevX = startX;
          droneStateRef.current.prevY = startY;
          droneStateRef.current.tilt = 0;
          droneStateRef.current.targetTilt = 0;

          if (isVisibleRef.current) {
            startRAF();
          } else {
            drawStaticFrame();
          }
        }
      } else {
        // Subsequent grid rebuilds (e.g. window resize): clamp coordinates without resetting intro flight
        const drone = droneStateRef.current;
        drone.x = Math.max(0, Math.min(width, drone.x));
        drone.y = Math.max(0, Math.min(height, drone.y));
        drone.targetX = Math.max(0, Math.min(width, drone.targetX));
        drone.targetY = Math.max(0, Math.min(height, drone.targetY));
        drone.prevX = Math.max(0, Math.min(width, drone.prevX));
        drone.prevY = Math.max(0, Math.min(height, drone.prevY));

        if (isVisibleRef.current && !isReduced) {
          startRAF();
        } else {
          drawStaticFrame();
        }
      }
    };

    rebuildGrid();

    // ResizeObserver for canvas grid setup
    const resizeObserver = new ResizeObserver(() => {
      rebuildGrid();
    });
    resizeObserver.observe(section);

    // IntersectionObserver for visibility tracking (pause RAF completely when off-screen)
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isIntersecting = entry.isIntersecting;
          isVisibleRef.current = isIntersecting;
          if (isIntersecting) {
            if (!reducedMotionRef.current) {
              lastFrameTimeRef.current = performance.now();
              if (!introFlightRef.current.finished) {
                startRAF();
              } else if (motionModeRef.current === 'idle-sine' && isInteractiveRef.current) {
                startRAF();
              } else if (isInteractiveRef.current) {
                if (pointerRef.current.hasValue) {
                  const rect = section.getBoundingClientRect();
                  const mx = pointerRef.current.clientX - rect.left;
                  const my = pointerRef.current.clientY - rect.top;
                  droneStateRef.current.targetX = mx;
                  droneStateRef.current.targetY = my;
                }
                scheduleIdleSineTimeout();
                startRAF();
              } else {
                drawStaticFrame();
              }
            } else {
              drawStaticFrame();
            }
          } else {
            clearIdleTimeout();
            stopRAF();
          }
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(section);

    // Pointer move listener: stores pointer location and triggers RAF when Hero is active
    const handlePointerMove = (e: MouseEvent) => {
      pointerRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        hasValue: true,
      };

      if (!isInteractiveRef.current || reducedMotionRef.current || !isVisibleRef.current) return;

      if (introFlightRef.current.finished) {
        motionModeRef.current = 'pointer';

        const rect = section.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        droneStateRef.current.targetX = mx;
        droneStateRef.current.targetY = my;

        scheduleIdleSineTimeout();
        startRAF();
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Handle tab focus changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearIdleTimeout();
        stopRAF();
      } else if (isVisibleRef.current && !reducedMotionRef.current) {
        lastFrameTimeRef.current = performance.now();
        if (introFlightRef.current.finished && isInteractiveRef.current) {
          if (motionModeRef.current === 'pointer') {
            scheduleIdleSineTimeout();
          }
        }
        startRAF();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearIdleTimeout();
      stopRAF();
      stopRAFRef.current = null;
      startRAFRef.current = null;
      drawStaticFrameRef.current = null;
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="scroll-mt-[88px] sm:scroll-mt-[108px] lg:scroll-mt-[120px] relative min-h-screen w-full flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 md:pt-28 pb-6 md:pb-8 bg-[#071A4D] overflow-hidden select-none"
    >
      {/* 1. Official BRASA Atmospheric Lighting Gradient (Noite Profunda -> Céu Aberto, Static) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(2,170,202,0.12)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(7,26,77,0.95)_0%,transparent_60%)]" />

        {/* Fine, subtle film grain texture for materiality */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 2. Interactive Quadrangular Topography & Drone Silhouette Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none w-full h-full"
      />

      {/* 3. Main Editorial Headline (Foreground Z-10, Stable) */}
      <div className="relative z-10 my-auto max-w-[100rem] mx-auto w-full py-2 sm:py-6 md:py-8">
        <div className="space-y-1 md:space-y-2 max-w-5xl lg:max-w-none">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-brasa-display text-[#FFFAF4] tracking-tight leading-[0.95]">
            <span
              ref={headlineLine1Ref}
              className="block text-3xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] 2xl:text-[6.25rem] hero-line1"
            >
              {siteContent.hero.headline.line1}
            </span>
            <span
              ref={headlineLine2Ref}
              className="font-brasa-display text-[#FB9627] text-4xl sm:text-6xl md:text-7xl lg:text-[7.25rem] xl:text-[8rem] 2xl:text-[9.25rem] block my-0.5 sm:my-1 hero-line2"
            >
              {siteContent.hero.headline.line2}
            </span>
            <span
              ref={headlineLine3Ref}
              className="font-brasa-display uppercase text-xl sm:text-3xl md:text-4xl lg:text-[3.25rem] xl:text-[3.5rem] 2xl:text-[4.25rem] tracking-wider block text-[#FFFAF4] hero-line3"
            >
              {siteContent.hero.headline.line3}
            </span>
          </h1>
        </div>
      </div>

      {/* 4. Elegant, Minimal Scroll Cue (Vertical Line + Geometric Chevron) */}
      <div
        ref={scrollCueRef}
        className="relative z-10 max-w-[100rem] mx-auto w-full flex items-center justify-start pt-4 md:pt-6"
      >
        <button
          onClick={onExplore}
          className="group flex flex-col items-center focus:outline-none cursor-pointer"
          aria-label={siteContent.hero.scrollCueAriaLabel}
        >
          <div className="flex flex-col items-center gap-1.5 transition-transform duration-300 group-hover:translate-y-1">
            {/* 30px-40px Vertical Line */}
            <div className="w-[1.5px] h-8 sm:h-10 bg-gradient-to-b from-[#FB9627] via-[#FFFAF4]/80 to-[#FFFAF4]/30" />
            {/* 5px-7px Geometric Chevron */}
            <svg
              className="w-2 h-2 text-[#FFFAF4]/80 transition-colors group-hover:text-[#FB9627]"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2,3 5,6 8,3" />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
}
