import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ShoppingBag, Globe, BarChart2, TrendingUp, Users, Smartphone, Zap, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title: string;
    icon?: React.ReactNode;
    links: { label: string; href: string }[];
  }[];
}

const iconMap: Record<string, React.ReactNode> = {
  'Consumer Goods & FMCG': <ShoppingBag size={18} className="text-primary-500" />,
  'Media & Advertising': <Smartphone size={18} className="text-primary-500" />,
  'Technology & Telecommunications': <Zap size={18} className="text-primary-500" />,
  'Internet': <Globe size={18} className="text-primary-500" />,
  'Economy & Society': <Users size={18} className="text-primary-500" />,
  'Retail & Trade': <Database size={18} className="text-primary-500" />,
  'Trending Now': <TrendingUp size={18} className="text-primary-500" />,
  'Industrial Reports': <BarChart2 size={18} className="text-primary-500" />,
};

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, content }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="absolute top-[80px] left-0 w-full bg-white border-b border-gray-200 shadow-xl z-[1000] py-12 px-6"
      onMouseLeave={onClose}
      ref={menuRef}
    >
      <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {content.map((column, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="font-display font-semibold text-gray-950 text-sm flex items-center gap-2">
              {iconMap[column.title] || <BarChart2 size={18} className="text-primary-500" />}
              {column.title}
            </h4>
            <ul className="space-y-3">
              {column.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <Link 
                    to={link.href}
                    className="font-body text-sm text-gray-600 hover:text-primary-500 hover:pl-2 transition-all block"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;
