import AnalysisPage from '../../components/analysis/AnalysisPage';
import { statisticsAnalysisConfigs } from '../../data/analysisDatasets';

export default function ComprehensiveAnalysis() {
  return (
    <AnalysisPage
      title="Comprehensive Analysis"
      description="Review cross-domain performance indicators using the full comprehensive-analysis dataset set."
      breadcrumb={[
        { label: 'Statistics' },
        { label: 'Data Analysis' },
        { label: 'Comprehensive Analysis' },
      ]}
      datasets={statisticsAnalysisConfigs.comprehensive}
    />
  );
}
