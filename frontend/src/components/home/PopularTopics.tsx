import React from 'react';

const topics = [
  'U.S. tariffs',
  'Social media usage',
  'E-commerce worldwide',
  'Artificial intelligence (AI)',
  'Netflix',
  'Global inflation',
  'TikTok',
  'Electric vehicles',
  'Sustainability',
  'Gaming'
];

const PopularTopics: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <span className="text-sm font-body text-gray-500 mr-2 flex items-center">Popular topics:</span>
      {topics.map((topic, index) => (
        <button 
          key={index}
          className="px-4 py-2 rounded-full bg-primary-100 text-primary-600 text-sm font-medium hover:bg-primary-500 hover:text-white hover:-translate-y-1 shadow-sm transition-all"
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

export default PopularTopics;