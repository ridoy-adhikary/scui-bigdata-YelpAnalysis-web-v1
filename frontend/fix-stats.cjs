const fs = require('fs');
const fixContent = import React, { useMemo, useState } from 'react';
import { useCsvData } from '../../hooks/useCsvData';
import DataTable from '../../components/common/DataTable';
import InteractiveBarChart from '../../components/charts/InteractiveBarChart';
import InteractivePieChart from '../../components/charts/InteractivePieChart';
import Breadcrumb from '../../components/common/Breadcrumb';
interface AnalysisSectionProps {
  title: string;
  description: string;
  csvUrl: string;
  chartType: 'bar' | 'pie';
  xAxisKey: string;
  yAxisKey: string;
  index: number;
}
const AnalysisSection: React.FC<AnalysisSectionProps> = ({ title, description, csvUrl, chartType, xAxisKey, yAxisKey, index }) => {
  const { data, columns, loading, error } = useCsvData<any>(csvUrl);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data.slice(0, 50);
    const lower = searchTerm.toLowerCase();
    return data.filter(row => 
      Object.keys(row).some(key => String(row[key]).toLowerCase().includes(lower))
    ).slice(0, 50);
  }, [data, searchTerm]);
  const tableColumns = useMemo(() => {
    return columns.map(col => ({
      accessorKey: col,
      header: col
    }));
  }, [columns]);
  const mapChartData = useMemo(() => {
     if (!filteredData.length) return { labels: [], datasets: [] };
     return {
        labels: filteredData.map(item => item[xAxisKey] || 'Unknown').slice(0, 15),
        datasets: [
          {
            label: title,
            data: filteredData.map(item => Number(item[yAxisKey]) || 0).slice(0, 15),
            backgroundColor: [
              'rgba(211, 35, 35, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)'
            ],
          }
        ]
     }
  }, [filteredData, xAxisKey, yAxisKey, title]);
  if (loading) return <div className="text-center p-8">Loading {title}...</div>;
  if (error) return <div className="text-red-500 p-8">Error loading {title}: {error}</div>;
  const isEven = index % 2 === 0;
  return (
    <div className="mb-16">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 pb-2 border-b-2 border-yelp-red inline-block">{title}</h2>
        <div className={\lex flex-col lg:flex-row gap-8 \\}>
          <div className="flex-1 w-full lg:w-1/2 p-4 bg-white rounded-lg shadow border border-gray-100 flex flex-col">
            <input type="text" placeholder="Search..." className="w-full p-2 border border-gray-300 rounded focus:ring-yelp-red mb-4" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="max-h-96 overflow-auto flex-1">
              {tableColumns.length > 0 && <DataTable columns={tableColumns} data={filteredData} />}
            </div>
            <p className="text-sm text-gray-500 mt-4 border-t pt-2">{description}</p>
          </div>
          <div className="flex-1 w-full lg:w-1/2 p-4 bg-white rounded-lg shadow border border-gray-100 flex flex-col">
            <div className="flex-1 w-full flex items-center justify-center min-h-[300px]">
               {chartType === 'bar' ? (
                   <InteractiveBarChart data={mapChartData} title={title} />
               ) : (
                   <InteractivePieChart data={mapChartData} title={title} />
               )}
            </div>
            <p className="text-sm italic text-center text-gray-600 mt-4 border-t pt-2">Caption: Visual representation of {title}.</p>
          </div>
        </div>
    </div>
  );
};
const BusinessAnalysis = () => {
  const sections = [
    { title: 'Top 20 Merchants', description: 'Analysis of the top 20 merchants by review count. The table displays raw metrics while the chart visualizes volume.', csvUrl: '/data/data-analysis/business-analysis/01_top_20_merchants.csv', chartType: 'bar' as const, xAxisKey: 'name', yAxisKey: 'review_count' },
    { title: 'Top 10 Cities', description: 'Distribution of businesses across active cities in the Yelp ecosystem.', csvUrl: '/data/data-analysis/business-analysis/02_top_10_cities.csv', chartType: 'pie' as const, xAxisKey: 'city', yAxisKey: 'business_count' },
    { title: 'Top 5 States', description: 'Geographical footprint of businesses by state highlighting the dominance in North America.', csvUrl: '/data/data-analysis/business-analysis/03_top_5_states.csv', chartType: 'bar' as const, xAxisKey: 'state', yAxisKey: 'business_count' }
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Breadcrumb items={[{ label: 'Statistics' }, { label: 'Data Analysis' }, { label: 'Business Analysis' }]} />
      <div className="mt-8 mb-12">
        <h1 className="text-4xl font-display font-bold text-gray-900">Business Analysis</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl">Explore key business metrics derived from JSON repositories, focusing on distributions and geolocation.</p>
      </div>
      <div className="flex flex-col">
        {sections.map((sec, idx) => <AnalysisSection key={idx} index={idx} {...sec} />)}
      </div>
    </div>
  );
}
export default BusinessAnalysis;
;
fs.writeFileSync('src/pages/statistics/BusinessAnalysis.tsx', fixContent);
const pages = [
  {
    name: 'ReviewAnalysis',
    title: 'Review Analysis',
    c1: '/data/data-analysis/review-analysis/01_reviews_per_year.csv',
    c2: '/data/data-analysis/review-analysis/03_total_number_of_reviews.csv',
    c3: '/data/data-analysis/review-analysis/10_review_length_vs_rating.csv',
    x: 'Category/Time',
    y: 'Review Count'
  },
  {
    name: 'CheckinAnalysis',
    title: 'Check-in Analysis',
    c1: '/data/data-analysis/checkin-analysis/01_number_of_checkins_per_year.csv',
    c2: '/data/data-analysis/checkin-analysis/02_checkins_per_hours.csv',
    c3: '/data/data-analysis/checkin-analysis/03_Most_Popular_City_for_Checkins.csv',
    x: 'Time',
    y: 'Checkin Count'
  },
  {
    name: 'RatingAnalysis',
    title: 'Rating Analysis',
    c1: '/data/data-analysis/rating-analysis/01_rating_distribution.csv',
    c2: '/data/data-analysis/rating-analysis/02_weekly_rating_frequency.csv',
    c3: '/data/data-analysis/rating-analysis/04_top_ten_cities_with_highest_ratings.csv',
    x: 'Rating',
    y: 'Distribution'
  },
  {
    name: 'ComprehensiveAnalysis',
    title: 'Comprehensive Analysis',
    c1: '/data/data-analysis/comprehensive-analysis/01_top5_merchants_per_city.csv',
    c2: '/data/data-analysis/comprehensive-analysis/02_review_conversion_rate.csv',
    c3: '/data/data-analysis/comprehensive-analysis/03_checkin_dropoff_analysis_1.csv',
    x: 'Merchant/City',
    y: 'Ratio'
  },
  {
    name: 'UserAnalysis',
    title: 'User Analysis',
    c1: '/data/data-analysis/user-analysis/2.Top_Reviewers.csv',
    c2: '/data/data-analysis/user-analysis/3.Most_Popular_Users.csv',
    c3: '/data/data-analysis/user-analysis/7.Early_Adopters.csv',
    x: 'User Name',
    y: 'Count'
  }
];
pages.forEach(p => {
  let newContent = fixContent
    .replace(/BusinessAnalysis/g, p.name)
    .replace(/Business Analysis/g, p.title)
    .replace(/\/data\/data-analysis\/business-analysis\/01_top_20_merchants\.csv/g, p.c1)
    .replace(/\/data\/data-analysis\/business-analysis\/02_top_10_cities\.csv/g, p.c2)
    .replace(/\/data\/data-analysis\/business-analysis\/03_top_5_states\.csv/g, p.c3)
    .replace(/xAxisKey: 'name'/g, "xAxisKey: '" + p.x + "'")
    .replace(/xAxisKey: 'city'/g, "xAxisKey: '" + p.x + "'")
    .replace(/xAxisKey: 'state'/g, "xAxisKey: '" + p.x + "'")
    .replace(/yAxisKey: 'review_count'/g, "yAxisKey: '" + p.y + "'")
    .replace(/yAxisKey: 'business_count'/g, "yAxisKey: '" + p.y + "'");
  fs.writeFileSync('src/pages/statistics/' + p.name + '.tsx', newContent);
});
