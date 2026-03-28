import { gsap } from 'gsap';
export const pageLoadAnimation = () => {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  tl.from('header', { y: -100, opacity: 0, duration: 0.6 })
    .from('.hero-heading', { y: 30, opacity: 0, duration: 0.8 }, '-=0.3');
  return tl;
};