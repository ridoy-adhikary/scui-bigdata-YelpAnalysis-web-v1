import AnalysisPage from '../../components/analysis/AnalysisPage';
import { statisticsAnalysisConfigs } from '../../data/analysisDatasets';

export default function BusinessAnalysis() {
  return (
    <AnalysisPage
      title="Business Analysis"
      description="Explore all business-focused CSV datasets with interactive charts, searchable tables, and alternating chart/table layouts."
      breadcrumb={[
        { label: 'Statistics' },
        { label: 'Data Analysis' },
        { label: 'Business Analysis' },
      ]}
      datasets={statisticsAnalysisConfigs.business}
    />
  );
}
