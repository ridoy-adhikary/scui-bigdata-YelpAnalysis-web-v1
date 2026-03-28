import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StatCard from '../cards/StatCard';

gsap.registerPlugin(ScrollTrigger);

const mockTrendingStats = [
  {
    id: '1',
    title: 'Global Smartphone Shipments Market Share',
    category: 'Technology',
    date: '2024-03-01',
    chartType: 'pie',
    chartData: {
      labels: ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Others'],
      datasets: [{
        data: [20, 19, 13, 9, 39],
        backgroundColor: ['#0088CC', '#FF6B35', '#00B4A0', '#FFD700', '#9B59B6'],
      }]
    },
    link: '/statistics'
  },
  {
    id: '2',
    title: 'E-commerce Revenue Worldwide (in billion USD)',
    category: 'Economy',
    date: '2024-02-15',
    chartType: 'bar',
    chartData: {
      labels: ['2020', '2021', '2022', '2023', '2024'],
      datasets: [{
        label: 'Revenue',
        data: [4248, 4921, 5424, 5912, 6310],
        backgroundColor: '#0088CC',
      }]
    },
    link: '/statistics'
  },
  {
    id: '3',
    title: 'Social Media User Growth Trends',
    category: 'Media',
    date: '2024-03-10',
    chartType: 'line',
    chartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Users (Millions)',
        data: [4200, 4350, 4480, 4600, 4750, 4900],
        borderColor: '#00B4A0',
        fill: true,
      }]
    },
    link: '/statistics'
  }
];

const TrendingStats: React.FC = () => {
  useEffect(() => {
    const cards = gsap.utils.toArray('.stat-card');
    cards.forEach((card: any, index: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 60,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });
  }, []);

  return (
    <section className="py-20 px-6 bg-white max-w-content mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-950 mb-4">
          Trending statistics
        </h2>
        <p className="text-gray-600 text-lg">
          Get facts and insights on topics that matter
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockTrendingStats.map(stat => (
          <StatCard key={stat.id} {...(stat as any)} />
        ))}
      </div>
    </section>
  );
};

export default TrendingStats;