import AnalysisPage from '../../components/analysis/AnalysisPage';
import { statisticsAnalysisConfigs } from '../../data/analysisDatasets';

export default function UserAnalysis() {
  return (
    <AnalysisPage
      title="User Analysis"
      description="Track user behavior, participation, and engagement trends across all available user-analysis datasets."
      breadcrumb={[
        { label: 'Statistics' },
        { label: 'Data Analysis' },
        { label: 'User Analysis' },
      ]}
      datasets={statisticsAnalysisConfigs.user}
    />
  );
}
