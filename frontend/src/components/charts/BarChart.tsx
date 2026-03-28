import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: any;
  options?: any;
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0F1419',
        bodyColor: '#6C757D',
        borderColor: '#E9ECEF',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          family: 'IBM Plex Sans',
          size: 14,
          weight: 600
        },
        bodyFont: {
          family: 'Roboto Mono',
          size: 13,
          weight: 500
        },
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 11 } }
      },
      y: {
        grid: { color: '#F8F9FA' },
        ticks: { font: { family: 'Roboto Mono', size: 11 } }
      }
    },
    ...options
  };

  return <Bar data={data} options={defaultOptions} />;
};

export default BarChart;