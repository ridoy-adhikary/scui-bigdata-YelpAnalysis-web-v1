import AnalysisPage from '../../components/analysis/AnalysisPage';
import { statisticsAnalysisConfigs } from '../../data/analysisDatasets';

export default function CheckinAnalysis() {
  return (
    <AnalysisPage
      title="Check-in Analysis"
      description="Analyze yearly, hourly, city-level, and business-level check-in behavior using the full check-in dataset collection."
      breadcrumb={[
        { label: 'Statistics' },
        { label: 'Data Analysis' },
        { label: 'Check-in Analysis' },
      ]}
      datasets={statisticsAnalysisConfigs.checkin}
    />
  );
}
