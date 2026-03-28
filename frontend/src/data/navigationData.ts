export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

export const navigationData: NavItem[] = [
  {
    label: 'Statistics',
    children: [
      {
        label: 'Data Analysis',
        children: [
          {
            label: 'Business Analysis',
            href: '/statistics/data-analysis/business-analysis'
          },
          {
            label: 'User Analysis',
            href: '/statistics/data-analysis/user-analysis'
          },
          {
            label: 'Review Analysis',
            href: '/statistics/data-analysis/review-analysis'
          },
          {
            label: 'Check-in Analysis',
            href: '/statistics/data-analysis/checkin-analysis'
          },
          {
            label: 'Rating Analysis',
            href: '/statistics/data-analysis/rating-analysis'
          },
          {
            label: 'Comprehensive Analysis',
            href: '/statistics/data-analysis/comprehensive-analysis'
          }
        ]
      }
    ]
  },
  {
    label: 'Insights',
    children: [
      {
        label: 'Data Enrichment',
        children: [
          {
            label: 'Weather-Mood Hypothesis',
            href: '/insights/data-enrichment/weather-mood'
          },
          {
            label: 'Cursed Storefronts',
            href: '/insights/data-enrichment/cursed-storefronts'
          },
          {
            label: 'Review Manipulation Syndicate',
            href: '/insights/data-enrichment/review-manipulation'
          },
          {
            label: 'Open-World Data Safari',
            href: '/insights/data-enrichment/open-world-safari'
          }
        ]
      }
    ]
  },
  {
    label: 'Research AI',
    href: '/research-ai'
  }
];
