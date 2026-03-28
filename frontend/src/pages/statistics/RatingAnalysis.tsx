import AnalysisPage from '../../components/analysis/AnalysisPage';
import { statisticsAnalysisConfigs } from '../../data/analysisDatasets';

export default function RatingAnalysis() {
  return (
    <AnalysisPage
      title="Rating Analysis"
      description="Compare distribution, frequency, and contextual rating shifts across all rating-analysis CSV datasets."
      breadcrumb={[
        { label: 'Statistics' },
        { label: 'Data Analysis' },
        { label: 'Rating Analysis' },
      ]}
      datasets={statisticsAnalysisConfigs.rating}
    />
  );
}
