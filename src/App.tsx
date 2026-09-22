import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import OriginScrollSequence from './components/OriginScrollSequence';
import DoraDeepDive from './components/DoraDeepDive';
import TeamSection from './components/TeamSection';
import ManifestoSection from './components/ManifestoSection';
import Footer from './components/Footer';
import NoiseOverlay from './components/NoiseOverlay';
import NarrativeTimeline from './components/NarrativeTimeline';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');

  // Smooth scroll helper
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll listener for calculating active section based on header height and section scroll margin offset
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'origem', 'dora', 'brasa', 'equipe'];
      const headerEl = document.querySelector('header');
      const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 80;

      // Check if user is at the bottom of the page
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 30;

      if (isAtBottom) {
        setActiveSection(sections[sections.length - 1]);
        return;
      }

      let currentActive = 'hero';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Active section threshold: section becomes active when its top edge is at or near the header bottom
          const threshold = headerHeight + 35;
          if (rect.top <= threshold) {
            currentActive = id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#071A4D] text-[#FFFAF4] selection:bg-[#FB9627] selection:text-[#071A4D]">
      {/* Film Grain Texture Overlay */}
      <NoiseOverlay />

      {/* Main Navigation Bar */}
      <Header onNavigate={handleNavigate} activeSection={activeSection} />

      {/* Discrete Narrative Timeline */}
      <NarrativeTimeline activeSection={activeSection} />

      {/* 1. Present-Day BRASA Hero */}
      <HeroSection onExplore={() => handleNavigate('origem')} />

      {/* 2. Origin Scroll Sequence (Poli → Projeto Dora → BRASA) */}
      <OriginScrollSequence />

      {/* 3. Projeto Dora Spotlight */}
      <DoraDeepDive />

      {/* 4. BRASA Mission & Ambition */}
      <ManifestoSection />

      {/* 5. Present-Day Team */}
      <TeamSection />

      {/* 6. Footer & Social Connection */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
