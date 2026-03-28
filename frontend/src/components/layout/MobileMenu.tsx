import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: {
    label: string;
    href?: string;
    hasDropdown?: boolean;
  }[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navigationItems }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col"
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <span className="font-display font-bold text-primary-900 text-xl tracking-tight">STATISTA</span>
            <button 
              onClick={onClose}
              className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Search */}
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search statistics..."
                className="w-full h-12 bg-gray-100 border-none rounded-xl pl-12 pr-4 text-sm font-body focus:ring-2 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-6 py-4">
            <ul className="space-y-4">
              {navigationItems.map((item, idx) => (
                <li key={idx} className="border-b border-gray-50 pb-4">
                  <Link
                    to={item.href || '#'}
                    className="flex items-center justify-between text-lg font-display font-semibold text-gray-900 group"
                    onClick={() => !item.hasDropdown && onClose()}
                  >
                    {item.label}
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-primary-500 transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA Footer */}
          <div className="p-6 border-t border-gray-100">
            <Link
              to="/pricing"
              className="w-full h-14 bg-orange-500 text-white rounded-xl flex items-center justify-center font-display font-bold text-base shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
              onClick={onClose}
            >
              Prices & Access
            </Link>
            <div className="mt-6 flex justify-center gap-6 text-sm font-body text-gray-500">
              <Link to="/login" onClick={onClose}>Log in</Link>
              <span className="text-gray-200">|</span>
              <Link to="/register" onClick={onClose}>Register</Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
