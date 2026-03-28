import AnalysisPage from '../../components/analysis/AnalysisPage';
import { insightAnalysisConfigs, type AnalysisDatasetConfig } from '../../data/analysisDatasets';

const safariDatasets =
  (insightAnalysisConfigs as unknown as Record<string, AnalysisDatasetConfig[]>)['openWorldSafari'] ?? [];

export default function OpenWorldSafari() {
  return (
    <AnalysisPage
      title="The Open-World Data Safari"
      description="Explore free-form discovery tracks and emerging patterns from open-world enrichment data once source CSVs are added."
      breadcrumb={[
        { label: 'Insights' },
        { label: 'Data Enrichment' },
        { label: 'Open-World Data Safari' },
      ]}
      datasets={safariDatasets}
      emptyHint="No CSV files detected in public/data/data-enrichment/open-world-safari yet. Add files to render charts and tables."
    />
  );
}
