import BrasaLogo from './BrasaLogo';
import { siteContent } from '../content/siteContent';

interface FooterProps {
  onNavigate: (id: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#030C27] text-[#FFFAF4] border-t border-[#FB9627] py-10 sm:py-12 px-5 sm:px-8 md:px-12 font-brasa-body text-xs">
      <div className="max-w-[90rem] mx-auto space-y-8 sm:space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 justify-between items-start">
          {/* Brand Identity */}
          <div className="sm:col-span-2 md:col-span-5 flex items-center md:items-start">
            <BrasaLogo variant="light" className="h-[58px] sm:h-[76px] md:h-[86px] w-auto" />
          </div>

          {/* Clean Navigation */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-[10px] text-[#8B99B5] uppercase font-brasa-body-bold block">{siteContent.footer.navHeader}</span>
            <div className="flex flex-col gap-2 text-xs text-[#FFFAF4]/80 font-brasa-body">
              {siteContent.nav.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="text-left hover:text-[#FB9627] transition-colors focus:outline-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social Connection */}
          <div className="md:col-span-4 space-y-2 text-left md:text-right">
            <span className="text-[10px] text-[#8B99B5] uppercase font-brasa-body-bold block">{siteContent.footer.socialHeader}</span>
            <div className="flex flex-col md:items-end gap-2 text-xs text-[#FFFAF4]/80 font-brasa-body">
              {siteContent.footer.socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FB9627] transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#FFFAF4]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#8B99B5] font-brasa-body">
          <div>
            <span>{siteContent.footer.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
