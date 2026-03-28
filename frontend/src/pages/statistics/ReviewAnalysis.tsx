import AnalysisPage from '../../components/analysis/AnalysisPage';
import { statisticsAnalysisConfigs } from '../../data/analysisDatasets';

export default function ReviewAnalysis() {
  return (
    <AnalysisPage
      title="Review Analysis"
      description="Explore review volume, sentiment cues, word patterns, and textual quality metrics from all review-analysis CSV files."
      breadcrumb={[
        { label: 'Statistics' },
        { label: 'Data Analysis' },
        { label: 'Review Analysis' },
      ]}
      datasets={statisticsAnalysisConfigs.review}
    />
  );
}
