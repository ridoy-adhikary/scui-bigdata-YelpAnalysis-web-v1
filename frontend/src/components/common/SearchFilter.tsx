import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'range' | 'checkbox';
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

interface SearchFilterProps {
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  filterOptions?: FilterOption[];
}

export default function SearchFilter({
  onSearch,
  onFilter,
  filterOptions = []
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...activeFilters, [key]: value };
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    }
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilter?.({});
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="bg-white rounded-lg shadow-card p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search data..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yelp-red focus:border-transparent font-body"
            />
          </div>
        </div>

        {/* Filter Button */}
        {filterOptions.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-display font-medium relative"
          >
            <Filter size={20} />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-yelp-red text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOptions.map((option) => (
                <div key={option.key}>
                  <label className="block text-sm font-display font-medium text-gray-700 mb-2">
                    {option.label}
                  </label>

                  {option.type === 'select' && (
                    <select
                      value={activeFilters[option.key] || ''}
                      onChange={(e) => handleFilterChange(option.key, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yelp-red focus:border-transparent font-body"
                    >
                      <option value="">All</option>
                      {option.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {option.type === 'range' && (
                    <input
                      type="range"
                      min={option.min}
                      max={option.max}
                      value={activeFilters[option.key] || option.min}
                      onChange={(e) => handleFilterChange(option.key, Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yelp-red"
                    />
                  )}

                  {option.type === 'checkbox' && (
                    <div className="space-y-2">
                      {option.options?.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={activeFilters[option.key]?.includes(opt.value) || false}
                            onChange={(e) => {
                              const current = activeFilters[option.key] || [];
                              const updated = e.target.checked
                                ? [...current, opt.value]
                                : current.filter((v: string) => v !== opt.value);
                              handleFilterChange(option.key, updated.length > 0 ? updated : null);
                            }}
                            className="rounded border-gray-300 text-yelp-red focus:ring-yelp-red"
                          />
                          <span className="text-sm font-body text-gray-700">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 flex items-center gap-2 text-sm font-body text-yelp-red hover:text-yelp-red-dark transition-colors"
              >
                <X size={16} />
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
