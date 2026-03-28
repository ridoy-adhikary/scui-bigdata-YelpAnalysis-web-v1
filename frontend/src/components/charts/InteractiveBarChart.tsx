import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface InteractiveBarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
  onClick?: (datasetIndex: number, dataIndex: number) => void;
}

export default function InteractiveBarChart({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  height = 350,
  onClick
}: InteractiveBarChartProps) {
  const vividPalette = [
    '#FA532E', '#064B73', '#2D7EA8', '#00B4A0', '#FFC107', '#9B59B6', '#28A745', '#FF7A5C',
  ];

  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderWidth: dataset.borderWidth ?? 2,
      borderColor: dataset.borderColor ?? '#FFFFFF',
      backgroundColor:
        dataset.backgroundColor ??
        (data.labels.map((_, idx) => vividPalette[idx % vividPalette.length]) as string[]),
      hoverBorderWidth: 3,
      hoverBorderColor: '#064B73',
      borderRadius: 8,
      maxBarThickness: 42,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    onHover: (event, elements) => {
      const canvas = event.native?.target as HTMLCanvasElement | undefined;
      if (!canvas) return;
      canvas.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    },
    onClick: (_event, elements) => {
      if (elements.length > 0 && onClick) {
        const element = elements[0];
        onClick(element.datasetIndex, element.index);
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
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
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Inter',
            size: 12,
          },
          color: '#2D7EA8',
        },
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          font: {
            family: 'Inter',
            size: 13,
            weight: 'bold',
          },
          color: '#495057',
        },
      },
      y: {
        grid: {
          color: '#DFECF3',
          // @ts-ignore
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'Roboto Mono',
            size: 12,
          },
          color: '#2D7EA8',
          callback: function(value) {
            return new Intl.NumberFormat('en-US', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value as number);
          }
        },
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: {
            family: 'Inter',
            size: 13,
            weight: 'bold',
          },
          color: '#495057',
        },
      },
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
    hover: {
      mode: 'nearest',
      intersect: false,
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={enhancedData} options={options} />
    </div>
  );
}
