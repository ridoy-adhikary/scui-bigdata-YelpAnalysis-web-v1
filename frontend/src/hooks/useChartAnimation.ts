import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export const useChartAnimation = (selector: string = ".stat-card") => {
  useEffect(() => {
    const cards = gsap.utils.toArray(selector);
    cards.forEach((card: any, index: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 60,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out"
      });
    });
    return () => { ScrollTrigger.getAll().forEach(trigger => trigger.kill()); };
  }, [selector]);
};
