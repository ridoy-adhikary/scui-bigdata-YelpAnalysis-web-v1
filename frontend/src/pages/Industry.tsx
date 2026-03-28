import React from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Industry: React.FC = () => {
  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <div className="flex flex-col gap-8">
        <header className="border-b border-gray-200 pb-8">
          <h1 className="text-4xl font-display font-bold text-gray-950 mb-4">Industries & Markets</h1>
          <p className="text-lg text-gray-600 font-body max-w-2xl">
            Explore comprehensive data and insights across 170 industries and 150+ countries. 
            From consumer goods to high-tech markets.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
          {/* Placeholder content */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center animate-pulse">
              <span className="text-gray-300 font-display font-semibold">Loading industry {i}...</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Industry;
