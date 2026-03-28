const fs = require('fs'); 
const content = fs.readFileSync('src/pages/statistics/BusinessAnalysis.tsx', 'utf8');
const pages = [
  {
    name: 'ReviewAnalysis',
    title: 'Review Analysis',
    c1: '/data/data-analysis/review-analysis/01_reviews_per_year.csv',
    c2: '/data/data-analysis/review-analysis/03_total_number_of_reviews.csv',
    c3: '/data/data-analysis/review-analysis/10_review_length_vs_rating.csv',
    x: 'Category/Time',
    y: 'Review Count'
  },
  {
    name: 'CheckinAnalysis',
    title: 'Check-in Analysis',
    c1: '/data/data-analysis/checkin-analysis/01_number_of_checkins_per_year.csv',
    c2: '/data/data-analysis/checkin-analysis/02_checkins_per_hours.csv',
    c3: '/data/data-analysis/checkin-analysis/03_Most_Popular_City_for_Checkins.csv',
    x: 'Time',
    y: 'Checkin Count'
  },
  {
    name: 'RatingAnalysis',
    title: 'Rating Analysis',
    c1: '/data/data-analysis/rating-analysis/01_rating_distribution.csv',
    c2: '/data/data-analysis/rating-analysis/02_weekly_rating_frequency.csv',
    c3: '/data/data-analysis/rating-analysis/04_top_ten_cities_with_highest_ratings.csv',
    x: 'Rating',
    y: 'Distribution'
  },
  {
    name: 'ComprehensiveAnalysis',
    title: 'Comprehensive Analysis',
    c1: '/data/data-analysis/comprehensive-analysis/01_top5_merchants_per_city.csv',
    c2: '/data/data-analysis/comprehensive-analysis/02_review_conversion_rate.csv',
    c3: '/data/data-analysis/comprehensive-analysis/03_checkin_dropoff_analysis_1.csv',
    x: 'Merchant/City',
    y: 'Ratio'
  }
];
pages.forEach(p => {
  let newContent = content
    .replace(/BusinessAnalysis/g, p.name)
    .replace(/Business Analysis/g, p.title)
    .replace(/\/data\/data-analysis\/business-analysis\/01_top_20_merchants\.csv/g, p.c1)
    .replace(/\/data\/data-analysis\/business-analysis\/02_top_10_cities\.csv/g, p.c2)
    .replace(/\/data\/data-analysis\/business-analysis\/03_top_5_states\.csv/g, p.c3)
    .replace(/xAxisKey: 'name'/g, "xAxisKey: '" + p.x + "'")
    .replace(/xAxisKey: 'city'/g, "xAxisKey: '" + p.x + "'")
    .replace(/xAxisKey: 'state'/g, "xAxisKey: '" + p.x + "'")
    .replace(/yAxisKey: 'review_count'/g, "yAxisKey: '" + p.y + "'")
    .replace(/yAxisKey: 'business_count'/g, "yAxisKey: '" + p.y + "'");
  fs.writeFileSync('src/pages/statistics/' + p.name + '.tsx', newContent);
});
