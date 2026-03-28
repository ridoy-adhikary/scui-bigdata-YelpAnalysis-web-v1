import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: any;
  options?: any;
}

const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  const vividLine = '#FA532E';
  const enhancedData = {
    ...data,
    datasets: (data?.datasets || []).map((dataset: any) => ({
      ...dataset,
      borderColor: dataset.borderColor || vividLine,
      backgroundColor: dataset.backgroundColor || 'rgba(250, 83, 46, 0.18)',
      pointBackgroundColor: dataset.pointBackgroundColor || '#064B73',
      pointHoverBackgroundColor: '#FA532E',
      pointHoverBorderColor: '#FFFFFF',
      pointHoverBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 7,
      fill: dataset.fill ?? true,
    })),
  };

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    onHover: (event: any, elements: any[]) => {
      const canvas = event?.native?.target as HTMLCanvasElement | undefined;
      if (!canvas) return;
      canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(248, 251, 253, 0.97)',
        titleColor: '#064B73',
        bodyColor: '#233D53',
        borderColor: '#2D7EA8',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#2D7EA8', font: { family: 'Inter', size: 11 } } },
      y: { grid: { color: '#DFECF3' }, ticks: { color: '#2D7EA8', font: { family: 'Roboto Mono', size: 11 } } }
    },
    elements: {
      line: { tension: 0.35, borderWidth: 3 },
      point: { radius: 4, hoverRadius: 7 }
    },
    animation: {
      duration: 900,
      easing: 'easeOutQuart',
    },
    transitions: {
      active: {
        animation: {
          duration: 180,
        },
      },
    },
    ...options
  };

  return <Line data={enhancedData} options={defaultOptions} />;
};

export default LineChart;