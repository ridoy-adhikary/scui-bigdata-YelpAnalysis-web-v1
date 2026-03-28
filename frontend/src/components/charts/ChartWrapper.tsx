import React, { ReactNode } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import LoadingSpinner from '../common/LoadingSpinner';

interface ChartWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  title?: string;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ 
  children, 
  isLoading = false, 
  isEmpty = false,
  title 
}) => {
  return (
    <ErrorBoundary>
      <div className="w-full h-full min-h-[300px] flex flex-col">
        {title && <h3 className="text-lg font-display font-semibold mb-4 text-gray-900">{title}</h3>}
        
        <div className="flex-1 relative min-h-[250px] w-full bg-white rounded-lg">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
              <LoadingSpinner />
            </div>
          ) : isEmpty ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 font-body">
              No data available for the selected period
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ChartWrapper;
