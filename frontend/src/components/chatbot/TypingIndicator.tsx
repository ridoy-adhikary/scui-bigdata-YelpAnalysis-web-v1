import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-primary-100 p-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
        <span className="w-2 h-2 bg-primary-300 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-[150ms]"></span>
        <span className="w-2 h-2 bg-yelp-red rounded-full animate-bounce delay-[300ms]"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;