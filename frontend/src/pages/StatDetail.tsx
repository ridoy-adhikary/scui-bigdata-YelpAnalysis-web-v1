import React from 'react';
import { Calendar, Download, Share2, Globe, Tag } from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const StatDetail: React.FC = () => {
  return (
    <div className="max-w-content mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <header>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="primary">E-commerce</Badge>
              <div className="flex items-center text-gray-400 text-xs font-body gap-1">
                <Calendar size={14} /> Sep 2026
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-950 leading-tight mb-6">
              Global e-commerce revenue growth from 2017 to 2024, by region
            </h1>
          </header>

          <div className="aspect-video bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Globe size={32} className="text-primary-500" />
              </div>
              <p className="text-gray-400 font-body">Chart Visualization Placeholder</p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 font-body">
            <p>
              This statistic shows the global retail e-commerce sales growth from 2017 to 2024. In 2023, 
              global retail e-commerce sales were estimated to exceed 5.8 trillion U.S. dollars. 
              This figure is forecasted to grow by 39 percent in the coming years, 
              surpassing eight trillion dollars by 2027.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
            <h3 className="font-display font-bold text-gray-950 mb-6">Download this statistic</h3>
            <div className="space-y-3">
              <Button variant="primary" fullWidth className="gap-2">
                <Download size={18} /> Download PDF
              </Button>
              <Button variant="outline" fullWidth className="gap-2">
                <Download size={18} /> Download Excel
              </Button>
              <Button variant="outline" fullWidth className="gap-2">
                <Share2 size={18} /> Share Results
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-body mb-4">
                <Tag size={16} /> Related Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {['Retail', 'Technology', 'Global Trade'].map((tag) => (
                  <Badge key={tag} variant="gray">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatDetail;
