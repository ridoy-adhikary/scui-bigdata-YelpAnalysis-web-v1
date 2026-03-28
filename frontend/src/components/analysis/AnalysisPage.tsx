import { ReactNode, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import Breadcrumb from '../common/Breadcrumb';
import DataTable from '../common/DataTable';
import InteractiveBarChart from '../charts/InteractiveBarChart';
import InteractivePieChart from '../charts/InteractivePieChart';
import LineChart from '../charts/LineChart';
import { useCsvData } from '../../hooks/useCsvData';
import type { AnalysisDatasetConfig, ChartKind } from '../../data/analysisDatasets';

interface AnalysisPageProps {
  title: string;
  description: string;
  breadcrumb: { label: string; href?: string }[];
  datasets: AnalysisDatasetConfig[];
  topContent?: ReactNode;
  emptyHint?: string;
}

const palette = [
  'rgba(250, 83, 46, 0.88)',
  'rgba(6, 75, 115, 0.88)',
  'rgba(45, 126, 168, 0.88)',
  'rgba(0, 180, 160, 0.88)',
  'rgba(255, 193, 7, 0.88)',
  'rgba(155, 89, 182, 0.88)',
  'rgba(40, 167, 69, 0.88)',
  'rgba(255, 122, 92, 0.88)',
  'rgba(0, 115, 187, 0.88)',
  'rgba(63, 81, 181, 0.88)',
  'rgba(244, 67, 54, 0.88)',
  'rgba(255, 152, 0, 0.88)',
];

const toNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
};

const inferColumns = (
  columns: string[],
  rows: Record<string, unknown>[],
  preferredX?: string,
  preferredY?: string
) => {
  if (!columns.length) {
    return { xAxisKey: '', yAxisKey: '', numericColumns: [] as string[] };
  }

  const numericColumns = columns.filter((column) =>
    rows.some((row) => Number.isFinite(toNumber(row[column])))
  );

  const fallbackX = columns.find((column) => !numericColumns.includes(column)) ?? columns[0];

  const numericWithoutX = numericColumns.filter((column) => column !== fallbackX);

  // Prefer numeric columns that actually vary across rows.
  const findVaryingNumeric = (candidates: string[]) =>
    candidates.find((column) => {
      const unique = new Set(
        rows
          .map((row) => toNumber(row[column]))
          .filter((value) => Number.isFinite(value))
      );
      return unique.size > 1;
    });

  const fallbackY =
    findVaryingNumeric(numericWithoutX) ??
    numericWithoutX[0] ??
    findVaryingNumeric(numericColumns) ??
    numericColumns[0] ??
    columns[1] ??
    columns[0];

  const xAxisKey = preferredX && columns.includes(preferredX) ? preferredX : fallbackX;
  const preferredYValid = preferredY && columns.includes(preferredY) && preferredY !== xAxisKey;
  const yAxisKey = preferredYValid ? preferredY : fallbackY;

  return { xAxisKey, yAxisKey, numericColumns };
};

const aggregateRows = (
  rows: Record<string, unknown>[],
  xAxisKey: string,
  yAxisKey: string,
  mode: AnalysisDatasetConfig['chartAggregation']
) => {
  if (mode === 'none' || !xAxisKey || !yAxisKey) return rows;

  const grouped = new Map<string, { sum: number; count: number }>();

  rows.forEach((row) => {
    const x = String(row[xAxisKey] ?? 'Unknown');
    const y = toNumber(row[yAxisKey]);
    if (!Number.isFinite(y)) return;
    const current = grouped.get(x) ?? { sum: 0, count: 0 };
    current.sum += y;
    current.count += 1;
    grouped.set(x, current);
  });

  return Array.from(grouped.entries()).map(([x, stats]) => ({
    [xAxisKey]: x,
    [yAxisKey]: mode === 'meanByX' ? stats.sum / Math.max(stats.count, 1) : stats.sum,
  }));
};

const shouldHideColumn = (column: string, dataset: AnalysisDatasetConfig, rows: Record<string, unknown>[]) => {
  if (dataset.hiddenColumns?.includes(column)) return true;

  // Auto-hide very long text blobs by default to keep tables readable.
  const hasLongText = rows.some((row) => String(row[column] ?? '').length > 180);
  return hasLongText;
};

function AnalysisDatasetSection({ dataset, index }: { dataset: AnalysisDatasetConfig; index: number }) {
  const { data, columns, loading, error } = useCsvData<Record<string, unknown>>(dataset.csvPath);
  const [searchText, setSearchText] = useState('');

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return data;

    const needle = searchText.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(needle))
    );
  }, [data, searchText]);

  const { xAxisKey, yAxisKey, numericColumns } = useMemo(
    () => inferColumns(columns, filteredRows, dataset.preferredXAxis, dataset.preferredYAxis),
    [columns, filteredRows, dataset.preferredXAxis, dataset.preferredYAxis]
  );

  const limitedRows = filteredRows.slice(0, dataset.maxTableRows ?? 200);
  const chartSourceRows = aggregateRows(
    limitedRows,
    xAxisKey,
    yAxisKey,
    dataset.chartAggregation ?? 'none'
  );
  const chartRows = chartSourceRows.slice(0, 20);
  const chartType: ChartKind = dataset.preferredChartType ?? (chartRows.length <= 8 ? 'pie' : 'bar');
  const canRenderChart = Boolean(xAxisKey && yAxisKey && xAxisKey !== yAxisKey && numericColumns.length > 0);

  const chartData = useMemo(
    () => ({
      labels: chartRows.map((row) => String(row[xAxisKey] ?? 'Unknown')),
      datasets: [
        {
          label: dataset.title,
          data: chartRows.map((row) => {
            const numeric = toNumber(row[yAxisKey]);
            return Number.isFinite(numeric) ? numeric : 0;
          }),
          backgroundColor: palette,
        },
      ],
    }),
    [chartRows, xAxisKey, yAxisKey, dataset.title]
  );

  const visibleColumns = useMemo(
    () => columns.filter((column) => !shouldHideColumn(column, dataset, limitedRows)),
    [columns, dataset, limitedRows]
  );

  const tableColumns = useMemo<ColumnDef<Record<string, unknown>>[]>(
    () =>
      visibleColumns.map((column) => ({
        accessorKey: column,
        header: column,
        cell: (info) => String(info.getValue() ?? '-'),
      })),
    [visibleColumns]
  );

  if (loading) {
    return <div className="p-6 bg-white border border-gray-200 rounded-xl">Loading {dataset.title}...</div>;
  }

  if (error) {
    return <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-xl">{dataset.title}: {error}</div>;
  }

  const reverse = index % 2 === 1;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">{dataset.title}</h2>
      <p className="text-gray-600 mb-6">{dataset.description}</p>

      <div className="mb-4">
        <input
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Filter this dataset..."
          className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yelp-red"
        />
      </div>

      <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 ${reverse ? 'xl:[&>*:first-child]:order-2' : ''}`}>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <DataTable columns={tableColumns} data={limitedRows} searchable={false} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          {canRenderChart ? (
            chartType === 'pie' ? (
              <InteractivePieChart data={chartData} title={dataset.title} />
            ) : chartType === 'line' ? (
              <div style={{ height: '350px' }}>
                <LineChart
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: dataset.title,
                        data: chartData.datasets[0].data,
                        borderColor: '#FA532E',
                        backgroundColor: 'rgba(250, 83, 46, 0.15)',
                        pointBackgroundColor: '#FA532E',
                        fill: true,
                      },
                    ],
                  }}
                  options={{ plugins: { legend: { display: true } } }}
                />
              </div>
            ) : (
              <InteractiveBarChart data={chartData} title={dataset.title} />
            )
          ) : (
            <div className="min-h-[300px] flex items-center justify-center text-gray-500 text-sm">
              No numeric column detected for chart rendering.
            </div>
          )}
          <p className="mt-3 text-center text-sm text-gray-500 italic">
            Caption: {dataset.title} based on {chartRows.length} plotted rows.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AnalysisPage({
  title,
  description,
  breadcrumb,
  datasets,
  topContent,
  emptyHint,
}: AnalysisPageProps) {
  const [datasetFilter, setDatasetFilter] = useState('');

  const visibleDatasets = useMemo(() => {
    if (!datasetFilter.trim()) return datasets;
    const needle = datasetFilter.toLowerCase();
    return datasets.filter((dataset) => dataset.title.toLowerCase().includes(needle));
  }, [datasets, datasetFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Breadcrumb items={breadcrumb} />

      <div className="mt-8 mb-10">
        <h1 className="text-4xl font-display font-bold text-gray-900">{title}</h1>
        <p className="mt-3 text-lg text-gray-600 max-w-4xl">{description}</p>
      </div>

      {topContent}

      <div className="mb-8 flex items-center gap-4 flex-wrap">
        <input
          type="text"
          value={datasetFilter}
          onChange={(event) => setDatasetFilter(event.target.value)}
          placeholder="Find a chart/table section..."
          className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yelp-red"
        />
        <span className="text-sm text-gray-500">{visibleDatasets.length} sections</span>
      </div>

      {visibleDatasets.length > 0 ? (
        visibleDatasets.map((dataset, index) => (
          <AnalysisDatasetSection key={dataset.csvPath} dataset={dataset} index={index} />
        ))
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-gray-600">
          {emptyHint ?? 'No datasets matched the current filter.'}
        </div>
      )}
    </div>
  );
}

