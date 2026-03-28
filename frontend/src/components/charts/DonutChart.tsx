import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin: Plugin<'doughnut'> = {
  id: 'centerText',
  beforeDraw: (chart) => {
    const { ctx, chartArea: { left, top, width, height } } = chart;
    ctx.save();
    
    // Total value
    ctx.font = '700 24px "Roboto Mono"';
    ctx.fillStyle = '#0F1419';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const data = chart.data.datasets[0].data as number[];
    const total = data.reduce((a, b) => a + b, 0);
    
    ctx.fillText(
      new Intl.NumberFormat('en-US').format(total),
      left + width / 2,
      top + height / 2 - 10
    );
    
    // "Total" label
    ctx.font = '400 14px "Inter"';
    ctx.fillStyle = '#6C757D';
    ctx.fillText('Total', left + width / 2, top + height / 2 + 15);
    ctx.restore();
  }
};

interface DonutChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  height?: number | string;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, height = 300 }) => {
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          font: {
            family: 'Inter',
            size: 13,
            weight: 400
          },
          color: '#6C757D',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16
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
            const label = context.label || '';
            const value = context.parsed;
            const dataSet = context.dataset.data as number[];
            const total = dataSet.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${new Intl.NumberFormat('en-US').format(value)} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeOutCubic'
    }
  };

  return (
    <div style={{ height }}>
      <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
    </div>
  );
};

export default DonutChart;
