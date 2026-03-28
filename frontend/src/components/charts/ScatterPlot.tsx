import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

interface ScatterPlotProps {
  data: {
    datasets: {
      label: string;
      data: { x: number; y: number }[];
      backgroundColor?: string;
      borderColor?: string;
      pointRadius?: number;
    }[];
  };
  height?: number | string;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, height = 300 }) => {
  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            family: 'Inter',
            size: 13
          },
          color: '#6C757D',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0F1419',
        bodyColor: '#6C757D',
        borderColor: '#E9ECEF',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context: any) {
            return `(${context.parsed.x}, ${context.parsed.y})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        grid: {
          display: true,
          color: '#F8F9FA'
        },
        ticks: {
          font: {
            family: 'Roboto Mono',
            size: 12
          },
          color: '#6C757D'
        }
      },
      y: {
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
    }
  };

  return (
    <div style={{ height }}>
      <Scatter data={data} options={options} />
    </div>
  );
};

export default ScatterPlot;
