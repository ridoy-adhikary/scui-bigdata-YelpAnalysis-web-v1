export type ChartKind = 'bar' | 'pie' | 'line';
export type ChartAggregation = 'none' | 'sumByX' | 'meanByX';

export interface AnalysisDatasetConfig {
  title: string;
  description: string;
  csvPath: string;
  preferredChartType?: ChartKind;
  preferredXAxis?: string;
  preferredYAxis?: string;
  chartAggregation?: ChartAggregation;
  hiddenColumns?: string[];
  maxTableRows?: number;
}

interface InsightAnalysisConfigMap {
  weatherMood: AnalysisDatasetConfig[];
  cursedStorefronts: AnalysisDatasetConfig[];
  reviewManipulation: AnalysisDatasetConfig[];
  openWorldSafari: AnalysisDatasetConfig[];
}

const toTitle = (fileName: string) => {
  const withoutExtension = fileName.replace(/\.csv$/i, '');
  const withoutPrefix = withoutExtension.replace(/^\d+[A-Za-z]?[_\.-]*/, '');

  return withoutPrefix
    .replace(/[_\.]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const makeDatasets = (folder: string, files: string[]): AnalysisDatasetConfig[] =>
  files.map((fileName) => ({
    title: toTitle(fileName),
    description: `Interactive table and chart for ${toTitle(fileName)}.`,
    csvPath: `/data/${folder}/${fileName}`,
    chartAggregation: 'none',
    maxTableRows: 200,
  }));

export const statisticsAnalysisConfigs = {
  business: makeDatasets('data-analysis/business-analysis', [
    '01_top_20_merchants.csv',
    '02_top_10_cities.csv',
    '03_top_5_states.csv',
    '04_top_20_merchants_avg_rating.csv',
    '06_top_10_categories.csv',
    '07_top_20_merchants_5star_reviews.csv',
    '08_restaurant_types_count.csv',
    '09_review_count_by_cuisine.csv',
    '10_rating_distribution_by_cuisine.csv',
    '11_turnaround_merchants.csv',
    '12_category_synergy_pairs.csv',
    '13_polarizing_businesses.csv',
  ]),
  user: makeDatasets('data-analysis/user-analysis', [
    '1.Number_of_Users_Joining.csv',
    '2.Top_Reviewers.csv',
    '3.Most_Popular_Users.csv',
    '4.Ratio_of_Elite_Users_to_Regular_Users.csv',
    '5.Proportion_of_Total_Users_and_Silent_Users.csv',
    '6.Yearly_Statistics.csv',
    '7.Early_Adopters.csv',
    '8.User_Rating_Evolution.csv',
    '9.Dining_Diversity.csv',
    '10.Elite_Status_Impact.csv',
  ]),
  review: makeDatasets('data-analysis/review-analysis', [
    '01_reviews_per_year.csv',
    '02_useful__funny_cool_reviews.csv',
    '03_total_number_of_reviews.csv',
    '04_top_20_common_words.csv',
    '05_top_10_bigrams_positive_reviews.csv',
    '06_top_10_bigrams_negative_reviews.csv',
    '07_word_cloud_pos_tagging.csv',
    '08_word_association_graph.csv',
    '09_top_15_pain_point_bigrams.csv',
    '10_review_length_vs_rating.csv',
    '11_mixed_signal_reviews.csv',
    '12_menu_items_chinese_restaurants.csv',
  ]).map((dataset) => {
    if (dataset.csvPath.endsWith('11_mixed_signal_reviews.csv')) {
      return {
        ...dataset,
        preferredChartType: 'line' as const,
        preferredXAxis: 'Stars',
        preferredYAxis: 'Positive Keywords Found',
        chartAggregation: 'meanByX' as const,
        hiddenColumns: ['Review Text', 'rev_id'],
        maxTableRows: 50,
        description:
          'Mixed-signal reviews summarized by average positive keyword count per star rating. Full review text is hidden for readability.',
      };
    }

    if (dataset.csvPath.endsWith('08_word_association_graph.csv')) {
      return {
        ...dataset,
        preferredChartType: 'bar' as const,
        preferredXAxis: 'Word1',
        preferredYAxis: 'Association Strength',
        chartAggregation: 'sumByX' as const,
        maxTableRows: 120,
      };
    }

    if (dataset.csvPath.endsWith('03_total_number_of_reviews.csv')) {
      return {
        ...dataset,
        preferredChartType: 'bar' as const,
        preferredXAxis: 'Year',
        preferredYAxis: 'Review Count',
        chartAggregation: 'sumByX' as const,
        hiddenColumns: ['User ID'],
      };
    }

    return dataset;
  }),
  checkin: makeDatasets('data-analysis/checkin-analysis', [
    '01_number_of_checkins_per_year.csv',
    '02_checkins_per_hours.csv',
    '03_Most_Popular_City_for_Checkins.csv',
    '04_Rank_All_Businesses_by_Checkin_Count.csv',
    '05_MoM_Checkin_Growth_Rate.csv',
    '06_review_seasonality_by_cuisine.csv',
  ]),
  rating: makeDatasets('data-analysis/rating-analysis', [
    '01_rating_distribution.csv',
    '02_weekly_rating_frequency.csv',
    '03_top_businesses_with_most_five_stars.csv',
    '04_top_ten_cities_with_highest_ratings.csv',
    '05_rating_differential_by_cuisine_and_city.csv',
    '06A_weekend_vs_weekdays_for_nightlife.csv',
    '06B_weekend_vs_weekdays_daily_breakdown.csv',
  ]),
  comprehensive: makeDatasets('data-analysis/comprehensive-analysis', [
    '01_top5_merchants_per_city.csv',
    '02_review_conversion_rate.csv',
    '03_checkin_dropoff_analysis_1.csv',
    '03_checkin_dropoff_analysis_2.csv',
    '03_checkin_dropoff_analysis_3.csv',
    '03_checkin_dropoff_analysis_4.csv',
    '03_checkin_dropoff_analysis_5.csv',
  ]),
};

export const insightAnalysisConfigs: InsightAnalysisConfigMap = {
  weatherMood: makeDatasets('data-enrichment/weather-mood', [
    '01_avg_rating_by_weather_condition.csv',
    '02_checkin_volume_by_weather_condition.csv',
    '03_food_categories_by_extreme_weather.csv',
    '04b_overall_weather_impact_summary.csv',
    '04c_actionable_business_recommendations.csv',
    '04_avg_rating_by_weather_per_city.csv',
  ]).map((dataset) => {
    if (dataset.csvPath.endsWith('04_avg_rating_by_weather_per_city.csv')) {
      return {
        ...dataset,
        preferredChartType: 'bar' as const,
        preferredXAxis: 'weather_condition',
        preferredYAxis: 'avg_rating',
        hiddenColumns: ['weather_city'],
        maxTableRows: 80,
      };
    }

    return dataset;
  }),
  cursedStorefronts: makeDatasets('data-enrichment/cursed-storefronts', [
    '01_business_potential_distribution.csv',
    '01_walk_score_categories_distribution.csv',
    '02_Cursed_Level_Distribution.csv',
    '02_Failure_Rate_Distribution.csv',
    '02_Top_20_Most_Cursed_Cities.csv',
    '03_Rating_Distribution.csv',
    '03_Top_20_Cities_with_Golden_Locations.csv',
    '04_Attribute_Patterns_Parking_vs_Noise_Level.csv',
    '04_Noise_Level_in_Cursed_Locations.csv',
    '04_Parking_Availability_in_Cursed_Locations.csv',
    '05_Pain_Point_Distribution.csv',
  ]),
  reviewManipulation: makeDatasets('data-enrichment/review-manipulation', []),
  openWorldSafari: makeDatasets('data-enrichment/open-world-safari', []),
};

