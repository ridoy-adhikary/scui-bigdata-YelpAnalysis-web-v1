import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: any;
  options?: any;
}

const PieChart: React.FC<PieChartProps> = ({ data, options }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
        labels: {
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
          padding: 10
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0F1419',
        bodyColor: '#6C757D',
        borderColor: '#E9ECEF',
        borderWidth: 1,
        padding: 12,
      }
    },
    ...options
  };

  return <Doughnut data={data} options={defaultOptions} />;
};

export default PieChart;