import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook to register GSAP ScrollTrigger animations for elements with a specific class.
 * @param selector The CSS selector for target elements (default: '.stat-card')
 */
export const useScrollAnimation = (selector: string = '.stat-card') => {
  useEffect(() => {
    const elements = gsap.utils.toArray(selector);

    elements.forEach((el: any, index: number) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [selector]);
};

export default useScrollAnimation;
