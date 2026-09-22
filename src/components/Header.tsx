import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import BrasaLogo from './BrasaLogo';
import { siteContent } from '../content/siteContent';

interface HeaderProps {
  activeSection: string;
  onNavigate: (id: string) => void;
}

export default function Header({ activeSection, onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = siteContent.nav.items;

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const isLightSection = activeSection === 'brasa';
  const isDoraSection = activeSection === 'dora';
  const isOriginSection = activeSection === 'origem';

  const headerBgClass = isDoraSection
    ? 'bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#FFFAF4]/10 py-2 sm:py-3'
    : isLightSection
    ? 'bg-[#FFFAF4]/90 backdrop-blur-md border-b border-[#071A4D]/10 py-2 sm:py-3'
    : scrolled
    ? 'bg-[#071A4D]/90 backdrop-blur-md border-b border-[#FFFAF4]/10 py-2 sm:py-3'
    : 'bg-transparent py-3 sm:py-5';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
      <div className="max-w-[100rem] mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
        {/* Brand Official Horizontal Lockup */}
        {isOriginSection ? (
          <div aria-hidden="true" className="flex items-center">
            <div className="invisible pointer-events-none">
              <BrasaLogo
                variant="light"
                className="h-[64px] sm:h-[76px] lg:h-[88px] w-auto"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleNavClick('hero')}
            className="group flex items-center focus:outline-none cursor-pointer"
            aria-label={isDoraSection ? 'Projeto Dora - Início' : 'BRASA - Início'}
          >
            {isDoraSection ? (
              <img
                src="/brand/dora/projeto-dora-logo-horizontal-light.png"
                alt="Projeto Dora"
                className="h-[64px] sm:h-[76px] lg:h-[88px] w-auto transition-opacity duration-200 group-hover:opacity-90 object-contain"
              />
            ) : (
              <BrasaLogo
                variant={isLightSection ? 'dark' : 'light'}
                className="h-[64px] sm:h-[76px] lg:h-[88px] w-auto transition-opacity duration-200 group-hover:opacity-90"
              />
            )}
          </button>
        )}

        {/* Desktop Navigation (Wide screens 1024px+) */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10" aria-label="Navegação principal">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            let textColor = '';
            let indicatorBg = '';

            if (isDoraSection) {
              textColor = isActive
                ? 'text-[#F4879F] opacity-100'
                : 'text-[#FFFAF4]/80 hover:text-[#F4879F] hover:opacity-100';
              indicatorBg = 'bg-[#F4879F]';
            } else if (isLightSection) {
              textColor = isActive
                ? 'text-[#071A4D] opacity-100'
                : 'text-[#071A4D]/70 hover:text-[#071A4D] hover:opacity-100';
              indicatorBg = 'bg-[#FB9627]';
            } else {
              textColor = isActive
                ? 'text-[#FFFAF4] opacity-100'
                : 'text-[#FFFAF4]/70 hover:text-[#FFFAF4] hover:opacity-100';
              indicatorBg = 'bg-[#FB9627]';
            }

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group relative text-xs sm:text-sm font-brasa-body-bold uppercase tracking-widest py-1 cursor-pointer transition-colors duration-200 ${textColor}`}
              >
                {item.label}
                {/* Micro-interaction line */}
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] ${indicatorBg} transition-all duration-200 cubic-bezier(0.16,1,0.3,1) ${
                    isActive ? 'w-full opacity-100' : 'w-0 group-hover:w-full opacity-70'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Mobile / Tablet Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden p-2 focus:outline-none transition-colors cursor-pointer ${
            isDoraSection
              ? 'text-[#FFFAF4] hover:text-[#F4879F]'
              : isLightSection
              ? 'text-[#071A4D] hover:text-[#FB9627]'
              : 'text-[#FFFAF4] hover:text-[#FB9627]'
          }`}
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden backdrop-blur-lg border-b px-6 py-6 space-y-4 shadow-2xl ${
            isDoraSection
              ? 'bg-[#0F0F0F]/98 border-[#FFFAF4]/15'
              : isLightSection
              ? 'bg-[#FFFAF4]/98 border-[#071A4D]/15'
              : 'bg-[#071A4D]/98 border-[#FFFAF4]/15'
          }`}
        >
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left py-2 text-sm font-brasa-body-bold uppercase tracking-widest cursor-pointer transition-colors ${
                  activeSection === item.id
                    ? isDoraSection
                      ? 'text-[#F4879F]'
                      : 'text-[#FB9627]'
                    : isDoraSection
                    ? 'text-[#FFFAF4]/80 hover:text-[#F4879F]'
                    : isLightSection
                    ? 'text-[#071A4D]/80 hover:text-[#071A4D]'
                    : 'text-[#FFFAF4]/80 hover:text-[#FFFAF4]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
