import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Breadcrumb from '../common/Breadcrumb';
import SearchFilter from '../common/SearchFilter';
import DataTable from '../common/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface AnalysisSection {
  id: string;
  tableData: any[];
  chartComponent: ReactNode;
  tableColumns: ColumnDef<any>[];
  description: string;
  chartCaption: string;
  layout: 'table-left' | 'table-right';
}

interface AnalysisPageLayoutProps {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
  sections: AnalysisSection[];
  onSearch?: (query: string) => void;
  onFilter?: (filters: any) => void;
  filterOptions?: any[];
}

export default function AnalysisPageLayout({
  title,
  description,
  breadcrumbs,
  sections,
  onSearch,
  onFilter,
  filterOptions
}: AnalysisPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-3">
            {title}
          </h1>
          <p className="text-lg font-body text-gray-600 max-w-3xl">
            {description}
          </p>
        </motion.div>

        {/* Search and Filter */}
        <SearchFilter
          onSearch={onSearch}
          onFilter={onFilter}
          filterOptions={filterOptions}
        />

        {/* Analysis Sections */}
        <div className="mt-8 space-y-12">
          {sections.map((section, index) => (
            <AnalysisSectionComponent
              key={section.id}
              section={section}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual Analysis Section Component
function AnalysisSectionComponent({
  section,
  index
}: {
  section: AnalysisSection;
  index: number;
}) {
  const isTableLeft = section.layout === 'table-left';

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-card p-8"
    >
      {/* Section Description */}
      <p className="text-sm font-body text-gray-600 mb-6">
        {section.description}
      </p>

      {/* Table-Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Table */}
        <div className={isTableLeft ? 'order-1' : 'order-1 lg:order-2'}>
          <DataTable
            data={section.tableData}
            columns={section.tableColumns}
          />
        </div>

        {/* Chart */}
        <div className={isTableLeft ? 'order-2' : 'order-2 lg:order-1'}>
          <div className="h-full flex flex-col">
            <div className="flex-1 min-h-[350px]">
              {section.chartComponent}
            </div>
            {/* Chart Caption */}
            <p className="mt-4 text-xs font-body text-gray-500 italic text-center">
              {section.chartCaption}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
