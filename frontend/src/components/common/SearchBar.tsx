import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search statistics...',
  className 
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" 
        size={18} 
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 bg-gray-100 border border-transparent rounded-full pl-12 pr-6 text-sm font-body text-gray-950 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-primary-500 transition-all shadow-inner"
        aria-label={placeholder}
      />
    </div>
  );
};

export default SearchBar;
