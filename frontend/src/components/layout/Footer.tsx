import React from 'react';
import { Share2, Send, Briefcase, Camera } from 'lucide-react';

const footerData = [
  {
    title: 'Company',
    links: [
      { label: 'About Statista', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Career', href: '#' },
      { label: 'Statista R', href: '#' }
    ]
  },
  {
    title: 'Platform',
    links: [
      { label: 'First Steps', href: '#' },
      { label: 'Our Sources', href: '#' },
      { label: 'Success Stories', href: '#' }
    ]
  },
  {
    title: 'Products',
    links: [
      { label: 'Industries', href: '#' },
      { label: 'APIs', href: '#' },
      { label: 'Custom Research', href: '#' },
      { label: 'Strategy Consulting', href: '#' }
    ]
  },
  {
    title: 'Privacy',
    links: [
      { label: 'Legal', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Imprint', href: '#' },
      { label: 'Report Bug', href: '#' }
    ]
  },
  {
    title: 'Databases',
    links: [
      { label: 'statista.de', href: '#' },
      { label: 'ecommercedb.com', href: '#' },
      { label: 'Sitemap', href: '#' }
    ]
  }
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8 px-6">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {footerData.map((column, idx) => (
            <div key={idx}>
              <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-6">
                {column.title}
              </h4>
              <ul className="space-y-4">
                {column.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 text-sm transition-all hover:pl-1"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © 2026 Statista Clone. All rights reserved. Built with React & Tailwind.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              <Share2 size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              <Send size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              <Briefcase size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              <Camera size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;