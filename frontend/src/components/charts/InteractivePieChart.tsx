import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface InteractivePieChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      borderColor?: string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  height?: number;
}

export default function InteractivePieChart({
  data,
  title,
  height = 350
}: InteractivePieChartProps) {
  const vividPalette = [
    '#FA532E', '#064B73', '#2D7EA8', '#00B4A0', '#FFC107', '#9B59B6', '#28A745', '#FF7A5C',
  ];

  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor:
        dataset.backgroundColor ??
        (data.labels.map((_, idx) => vividPalette[idx % vividPalette.length]) as string[]),
      borderColor: dataset.borderColor ?? '#FFFFFF',
      borderWidth: dataset.borderWidth ?? 2,
      hoverOffset: 12,
    })),
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: true,
    },
    onHover: (event, elements) => {
      const canvas = event.native?.target as HTMLCanvasElement | undefined;
      if (!canvas) return;
      canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    },
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          font: {
            family: 'Inter',
            size: 12,
            weight: 'bold',
          },
          color: '#064B73',
          usePointStyle: true,
          padding: 16,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          family: 'IBM Plex Sans',
          size: 16,
          weight: 'bold',
        },
        color: '#064B73',
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(248, 251, 253, 0.97)',
        titleColor: '#064B73',
        bodyColor: '#233D53',
        borderColor: '#2D7EA8',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 10,
        titleFont: {
          family: 'IBM Plex Sans',
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          family: 'Roboto Mono',
          size: 13,
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${new Intl.NumberFormat('en-US').format(value)} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      duration: 950,
      easing: 'easeOutCubic',
    },
    transitions: {
      active: {
        animation: {
          duration: 180,
        },
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Pie data={enhancedData} options={options} />
    </div>
  );
}
