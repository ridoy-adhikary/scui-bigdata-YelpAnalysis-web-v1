import React from 'react';
import DataTable from '../components/common/DataTable';

import { ColumnDef } from '@tanstack/react-table';

type StatisticData = {
  industry: string;
  region: string;
  revenue: number;
  growth: number;
  status: string;
};

const columns: ColumnDef<StatisticData>[] = [
  { accessorKey: 'industry', header: 'Industry' },
  { accessorKey: 'region', header: 'Region' },
  { accessorKey: 'revenue', header: 'Revenue (B$)' },
  { accessorKey: 'growth', header: 'Growth (%)', cell: (info) => {
    const val = info.getValue() as number;
    return (
    <span className={val > 0 ? 'text-green-600' : 'text-red-600'}>
      {val > 0 ? '+' : ''}{val}%
    </span>
    );
  }},
  { accessorKey: 'status', header: 'Status', cell: (info) => {
    const val = info.getValue() as string;
    return (
    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
      {val}
    </span>
    );
  }}
];

const data = Array.from({ length: 50 }).map((_, i) => ({
  industry: ['Retail', 'Tech', 'Energy', 'Finance', 'Health'][i % 5],
  region: ['North America', 'Europe', 'Asia', 'Global'][i % 4],
  revenue: Math.floor(Math.random() * 1000) + 100,
  growth: parseFloat((Math.random() * 20 - 5).toFixed(1)),
  status: 'Published'
}));

const Statistics: React.FC = () => {
  return (
    <div className="py-20 px-6 max-w-content mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-gray-950 mb-4">Industry Insights Database</h1>
        <p className="text-gray-600 text-lg max-w-narrow">
          Explore comprehensive data across multiple sectors and regions. Our database is updated daily with the latest market trends.
        </p>
      </div>

      <DataTable columns={columns} data={data} pageSize={10} />
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-primary-50 p-8 rounded-2xl border border-primary-100">
          <h3 className="font-display font-bold text-xl text-primary-900 mb-4">Market Analysis Report</h3>
          <p className="text-primary-800/80 mb-6 text-sm leading-relaxed">
            Download our latest 2024 Global Market Outlook for a detailed analysis of the trends shown in this table.
          </p>
          <button className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-700 transition-colors">
            Download PDF
          </button>
        </div>
        <div className="bg-teal-50 p-8 rounded-2xl border border-teal-100">
          <h3 className="font-display font-bold text-xl text-teal-900 mb-4">Custom Data Requests</h3>
          <p className="text-teal-800/80 mb-6 text-sm leading-relaxed">
            Need specific data not shown here? Our research team can provide custom datasets tailored to your needs.
          </p>
          <button className="bg-teal-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors">
            Contact Research
          </button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;