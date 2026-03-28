import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';

interface StatCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  chartType: 'bar' | 'line' | 'pie';
  chartData: any;
  link: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, category, date, chartType, chartData }) => {
  const renderChart = () => {
    switch (chartType) {
      case 'bar': return <BarChart data={chartData} />;
      case 'line': return <LineChart data={chartData} />;
      case 'pie': return <PieChart data={chartData} />;
      default: return null;
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
      className="stat-card bg-white border border-gray-200 rounded-xl p-6 cursor-pointer flex flex-col h-full transition-shadow"
    >
      <div className="h-48 mb-6 relative">
        {renderChart()}
      </div>
      
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
            {category}
          </span>
          <div className="flex items-center text-gray-500 text-xs gap-1">
            <Calendar size={14} />
            {format(new Date(date), 'MMM dd, yyyy')}
          </div>
        </div>
        
        <h3 className="font-display font-semibold text-lg text-gray-950 mb-4 line-clamp-2">
          {title}
        </h3>
      </div>

      <div className="flex items-center gap-2 text-primary-500 font-medium text-sm mt-4 group">
        Read more 
        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
};

export default StatCard;