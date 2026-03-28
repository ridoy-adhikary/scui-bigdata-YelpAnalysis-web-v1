import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
}

const suggestions = [
  'Top 5 cities by rating',
  'Business review trend by year',
  'Most active reviewers',
  'Weather impact on check-ins'
];

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim()) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <div className="p-4 border-t border-primary-200 bg-white shrink-0">
      <div className="flex flex-wrap gap-2 mb-3">
        {suggestions.map((s, i) => (
          <button 
            key={i}
            onClick={() => onSend(s)}
            className="text-[11px] font-medium bg-primary-100 text-primary-700 border border-primary-200 hover:bg-white hover:text-primary-900 px-3 py-1.5 rounded-full transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <input 
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your question..."
          className="flex-grow h-12 bg-gray-100 border border-primary-200 focus:border-yelp-red focus:bg-white rounded-2xl px-5 text-sm transition-all outline-none text-primary-900"
        />
        <button 
          type="submit"
          disabled={!value.trim()}
          className="w-10 h-10 bg-yelp-red disabled:bg-primary-300 text-white rounded-xl flex items-center justify-center hover:bg-yelp-red-dark transition-all shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;