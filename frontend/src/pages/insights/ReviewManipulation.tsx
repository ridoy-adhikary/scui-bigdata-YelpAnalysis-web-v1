import AnalysisPage from '../../components/analysis/AnalysisPage';
import { insightAnalysisConfigs, type AnalysisDatasetConfig } from '../../data/analysisDatasets';

const manipulationDatasets =
  (insightAnalysisConfigs as unknown as Record<string, AnalysisDatasetConfig[]>)['reviewManipulation'] ?? [];

export default function ReviewManipulation() {
  return (
    <AnalysisPage
      title="The Review Manipulation Syndicate"
      description="Analyze suspicious review behavior, anomalies, and syndicate indicators once the review-manipulation CSV files are available."
      breadcrumb={[
        { label: 'Insights' },
        { label: 'Data Enrichment' },
        { label: 'Review Manipulation Syndicate' },
      ]}
      datasets={manipulationDatasets}
      emptyHint="No CSV files detected in public/data/data-enrichment/review-manipulation yet. Add files to render charts and tables."
    />
  );
}
