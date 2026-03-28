import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface AreaChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  };
  height?: number | string;
}

const AreaChart: React.FC<AreaChartProps> = ({ data, height = 300 }) => {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            family: 'Inter',
            size: 13,
            weight: 400
          },
          color: '#6C757D',
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
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
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12
          },
          color: '#6C757D'
        }
      },
      y: {
        stacked: true,
        grid: {
          display: true,
          color: '#F8F9FA',
          lineWidth: 1
        },
        ticks: {
          font: {
            family: 'Roboto Mono',
            size: 12
          },
          color: '#6C757D'
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 1.5,
        fill: true
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 5
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  const processedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      fill: true,
      borderWidth: 1.5
    }))
  };

  return (
    <div style={{ height }}>
      <Line data={processedData} options={options} />
    </div>
  );
};

export default AreaChart;
