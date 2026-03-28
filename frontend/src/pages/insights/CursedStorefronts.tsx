import AnalysisPage from '../../components/analysis/AnalysisPage';
import { insightAnalysisConfigs } from '../../data/analysisDatasets';

export default function CursedStorefronts() {
  return (
    <AnalysisPage
      title="The Cursed Storefronts & Multi-Dimensional Attribution"
      description="Investigate cursed-location patterns, failure rates, and attribution signals across all cursed-storefront CSV datasets."
      breadcrumb={[
        { label: 'Insights' },
        { label: 'Data Enrichment' },
        { label: 'Cursed Storefronts' },
      ]}
      datasets={insightAnalysisConfigs.cursedStorefronts}
    />
  );
}
