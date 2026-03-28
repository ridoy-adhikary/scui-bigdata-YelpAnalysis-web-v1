import React, { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { gsap } from 'gsap';
import PopularTopics from './PopularTopics';

const Hero: React.FC = () => {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    tl.from(h1Ref.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.2
    })
    .from(subRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8
    }, '-=0.6')
    .from(searchRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6
    }, '-=0.4');
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-100 to-white py-20 px-6 flex flex-col items-center text-center">
      <div className="max-w-content w-full mx-auto flex flex-col items-center">
        <h1 
          ref={h1Ref}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-900 leading-[1.1] mb-6 tracking-tight"
        >
          Empowering people <br className="hidden md:block" /> with data
        </h1>
        
        <p 
          ref={subRef}
          className="text-lg md:text-xl text-gray-600 max-w-narrow mb-12"
        >
          Insights and facts across 170 industries and 150+ countries
        </p>

        <div 
          ref={searchRef}
          className="relative w-full max-w-[700px] h-16 mb-8 group"
        >
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={24} />
          <input 
            type="text"
            placeholder="Search statistics, reports, and more..."
            className="w-full h-full rounded-full bg-white border border-gray-200 pl-16 pr-8 text-lg font-body shadow-card focus:outline-none focus:border-primary-500 focus:shadow-xl transition-all"
          />
        </div>

        <PopularTopics />
      </div>
    </section>
  );
};

export default Hero;