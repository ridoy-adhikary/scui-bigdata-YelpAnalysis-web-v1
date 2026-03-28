import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const BusinessAnalysis = lazy(() => import('./pages/statistics/BusinessAnalysis'));
const UserAnalysis = lazy(() => import('./pages/statistics/UserAnalysis'));
const ReviewAnalysis = lazy(() => import('./pages/statistics/ReviewAnalysis'));
const CheckinAnalysis = lazy(() => import('./pages/statistics/CheckinAnalysis'));
const RatingAnalysis = lazy(() => import('./pages/statistics/RatingAnalysis'));
const ComprehensiveAnalysis = lazy(() => import('./pages/statistics/ComprehensiveAnalysis'));
const WeatherMood = lazy(() => import('./pages/insights/WeatherMood'));
const CursedStorefronts = lazy(() => import('./pages/insights/CursedStorefronts'));
const ReviewManipulation = lazy(() => import('./pages/insights/ReviewManipulation'));
const OpenWorldSafari = lazy(() => import('./pages/insights/OpenWorldSafari'));
const ResearchAI = lazy(() => import('./pages/ResearchAI'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoadingSpinner />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              
              {/* Statistics Routes */}
              <Route path="statistics/data-analysis">
                <Route path="business-analysis" element={<BusinessAnalysis />} />
                <Route path="user-analysis" element={<UserAnalysis />} />
                <Route path="review-analysis" element={<ReviewAnalysis />} />
                <Route path="checkin-analysis" element={<CheckinAnalysis />} />
                <Route path="rating-analysis" element={<RatingAnalysis />} />
                <Route path="comprehensive-analysis" element={<ComprehensiveAnalysis />} />
              </Route>
              
              {/* Insights Routes */}
              <Route path="insights/data-enrichment">
                <Route path="weather-mood" element={<WeatherMood />} />
                <Route path="cursed-storefronts" element={<CursedStorefronts />} />
                <Route path="review-manipulation" element={<ReviewManipulation />} />
                <Route path="open-world-safari" element={<OpenWorldSafari />} />
              </Route>
              
              {/* Research AI Route */}
              <Route path="research-ai" element={<ResearchAI />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
