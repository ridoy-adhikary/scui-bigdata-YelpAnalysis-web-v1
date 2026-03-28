import Papa from 'papaparse';

export interface DataLoadResult<T = any> {
  data: T[];
  error: Error | null;
  loading: boolean;
}

// Generic CSV loader function
export async function loadCSV<T = any>(filePath: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.error('CSV parsing errors in ' + filePath + ':', results.errors);
          // Some CSVs might have minor issues but still provide data
          if (results.data && results.data.length > 0) {
            resolve(results.data as T[]);
          } else {
            reject(new Error('Failed to parse CSV: ' + results.errors[0].message));
          }
        } else {
          resolve(results.data as T[]);
        }
      },
      error: (error) => {
        console.error('CSV loading error for ' + filePath + ':', error);
        reject(error);
      }
    });
  });
}

// Load JSON files
export async function loadJSON<T = any>(filePath: string): Promise<T> {
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Failed to load JSON: ${response.statusText}`);
  }
  return response.json();
}

// Typed data loaders for each analysis type
export const dataLoaders = {
  // Business Analysis
  businessTopMerchants: () => loadCSV('/data/data-analysis/business-analysis/01_top_20_merchants.csv'),
  businessTopCities: () => loadCSV('/data/data-analysis/business-analysis/02_top_10_cities.csv'),
  businessTopStates: () => loadCSV('/data/data-analysis/business-analysis/03_top_5_states.csv'),
  businessTopMerchantsAvgRating: () => loadCSV('/data/data-analysis/business-analysis/04_top_20_merchants_avg_rating.csv'),
  businessTopCategories: () => loadCSV('/data/data-analysis/business-analysis/06_top_10_categories.csv'),
  businessRestaurantTypes: () => loadCSV('/data/data-analysis/business-analysis/08_restaurant_types_count.csv'),
  
  // User Analysis
  userJoining: () => loadCSV('/data/data-analysis/user-analysis/1.Number_of_Users_Joining.csv'),
  userTopReviewers: () => loadCSV('/data/data-analysis/user-analysis/2.Top_Reviewers.csv'),
  userEliteRatio: () => loadCSV('/data/data-analysis/user-analysis/4.Ratio_of_Elite_Users_to_Regular_Users.csv'),
  
  // Review Analysis
  reviewPerYear: () => loadCSV('/data/data-analysis/review-analysis/01_reviews_per_year.csv'),
  reviewWordCloud: () => loadCSV('/data/data-analysis/review-analysis/07_word_cloud_pos_tagging.csv'),
  
  // Rating Analysis
  ratingDistribution: () => loadCSV('/data/data-analysis/rating-analysis/01_rating_distribution.csv'),
  ratingWeeklyFreq: () => loadCSV('/data/data-analysis/rating-analysis/02_weekly_rating_frequency.csv'),
  
  // Check-in Analysis
  checkinPerYear: () => loadCSV('/data/data-analysis/checkin-analysis/01_number_of_checkins_per_year.csv'),
  checkinPerHour: () => loadCSV('/data/data-analysis/checkin-analysis/02_checkins_per_hours.csv'),
  
  // Data Enrichment - Weather-Mood
  weatherAvgRating: () => loadCSV('/data/data-enrichment/weather-mood/01_avg_rating_by_weather_condition.csv'),
  weatherCheckinVolume: () => loadCSV('/data/data-enrichment/weather-mood/02_checkin_volume_by_weather_condition.csv'),
  weatherCityAvgRating: () => loadCSV('/data/data-enrichment/weather-mood/04_avg_rating_by_weather_per_city.csv'),
  
  // Data Enrichment - Cursed Storefronts
  cursedStorefrontDistribution: () => loadCSV('/data/data-enrichment/cursed-storefronts/02_Cursed_Level_Distribution.csv'),
  cursedTopCities: () => loadCSV('/data/data-enrichment/cursed-storefronts/02_Top_20_Most_Cursed_Cities.csv'),
};
