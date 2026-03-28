import React from 'react';

const companyLogos = [
  { name: 'Google' },
  { name: 'Samsung' },
  { name: 'PayPal' },
  { name: 'Telekom' },
  { name: 'Adobe' },
  { name: 'P&G' },
];

const TrustBadges: React.FC = () => {
  return (
    <div className="py-20 bg-white px-6">
      <div className="max-w-content mx-auto text-center">
        <p className="font-body font-medium text-gray-500 mb-10 uppercase tracking-[0.2em] text-xs">
          Trusted by more than 23,000 companies
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center justify-items-center opacity-60">
          {companyLogos.map((company, idx) => (
            <div 
              key={idx} 
              className="text-2xl font-display font-bold text-gray-400 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default"
            >
              {company.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;