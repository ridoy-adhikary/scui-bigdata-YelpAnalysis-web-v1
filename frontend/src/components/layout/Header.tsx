import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { navigationData, type NavItem } from '../../data/navigationData';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-primary-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-900 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-white font-display font-bold text-xl">Y</span>
            </div>
            <span className="text-2xl font-display font-bold text-primary-900">
              Yelp Analytics
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationData.map((item) => (
              <NavMenuItem
                key={item.label}
                item={item}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                isActive={isActive}
              />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-primary-300 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navigationData.map((item) => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  isActive={isActive}
                  onNavigate={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// Desktop Navigation Menu Item Component
interface NavMenuItemProps {
  item: NavItem;
  activeDropdown: string | null;
  setActiveDropdown: (label: string | null) => void;
  isActive: (href?: string) => boolean;
}

function collectLeafLinks(item: NavItem): NavItem[] {
  if (item.href) return [item];
  return (item.children ?? []).flatMap(collectLeafLinks);
}

function NavMenuItem({ item, activeDropdown, setActiveDropdown, isActive }: NavMenuItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = activeDropdown === item.label;

  if (!hasChildren && item.href) {
    return (
      <Link
        to={item.href}
        className={`font-display font-medium text-base transition-colors ${
          isActive(item.href)
            ? 'text-yelp-red'
            : 'text-primary-700 hover:text-yelp-red'
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setActiveDropdown(item.label)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button
        onClick={() => setActiveDropdown(isOpen ? null : item.label)}
        className={`flex items-center gap-1 font-display font-medium text-base transition-colors ${
          isActive(item.href)
            ? 'text-yelp-red'
            : 'text-primary-700 hover:text-yelp-red'
        }`}
      >
        {item.label}
        {hasChildren && (
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 pt-2 min-w-[360px] bg-white rounded-lg shadow-dropdown border border-primary-200 overflow-hidden"
          >
            {item.children!.map((group) => {
              const links = collectLeafLinks(group);

              return (
                <div key={group.label} className="p-2 border-b border-primary-100 last:border-b-0">
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-1 gap-1">
                    {links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href!}
                        onClick={() => setActiveDropdown(null)}
                        className={`block px-3 py-2 rounded-md text-sm font-body transition-colors ${
                          isActive(link.href)
                            ? 'bg-yelp-red text-white'
                            : 'text-primary-900 hover:bg-primary-100'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Nested Dropdown Item (Second Level)
interface NestedDropdownItemProps {
  item: NavItem;
  isActive: (href?: string) => boolean;
}

function NestedDropdownItem({ item, isActive }: NestedDropdownItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren && item.href) {
    return (
      <Link
        to={item.href}
        className={`block px-4 py-3 text-sm font-body transition-colors ${
          isActive(item.href)
            ? 'bg-yelp-red text-white'
            : 'text-primary-900 hover:bg-primary-100'
        }`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 text-sm font-body cursor-pointer transition-colors ${
          isActive(item.href)
            ? 'bg-yelp-red text-white'
            : 'text-primary-900 hover:bg-primary-100'
        }`}
      >
        {item.label}
        {hasChildren && <ChevronDown size={14} className="-rotate-90" />}
      </div>

      {/* Third Level Dropdown */}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 ml-1 w-64 bg-white rounded-lg shadow-dropdown border border-gray-200 overflow-hidden"
          >
            {item.children!.map((child) => (
              <Link
                key={child.label}
                to={child.href!}
                className={`block px-4 py-3 text-sm font-body transition-colors ${
                  isActive(child.href)
                    ? 'bg-yelp-red text-white'
                    : 'text-primary-900 hover:bg-primary-100'
                }`}
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile Navigation Item Component
interface MobileNavItemProps {
  item: NavItem;
  isActive: (href?: string) => boolean;
  onNavigate: () => void;
  level?: number;
}

function MobileNavItem({ item, isActive, onNavigate, level = 0 }: MobileNavItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const paddingLeft = `${(level + 1) * 12}px`;

  if (!hasChildren && item.href) {
    return (
      <Link
        to={item.href}
        onClick={onNavigate}
        className={`block py-2 text-sm font-body rounded transition-colors ${
          isActive(item.href)
            ? 'bg-yelp-red text-white'
            : 'text-primary-900 hover:bg-primary-100'
        }`}
        style={{ paddingLeft }}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 text-sm font-body text-primary-900 hover:bg-primary-100 rounded transition-colors"
        style={{ paddingLeft }}
      >
        {item.label}
        {hasChildren && (
          <ChevronDown
            size={16}
            className={`mr-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <MobileNavItem
                key={child.label}
                item={child}
                isActive={isActive}
                onNavigate={onNavigate}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
