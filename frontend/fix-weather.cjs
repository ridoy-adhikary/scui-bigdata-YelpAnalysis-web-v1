const fs = require('fs');
const weatherTemplate = import React, { useState, useMemo } from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useCsvData } from '../../hooks/useCsvData';
import CityMapWithData from '../../components/maps/CityMapWithData';
import DataTable from '../../components/common/DataTable';
import InteractiveBarChart from '../../components/charts/InteractiveBarChart';
import InteractivePieChart from '../../components/charts/InteractivePieChart';
const WeatherMood = () => {
  const { data: cityData } = useCsvData<any>('/data/data-enrichment/weather-mood/04_avg_rating_by_weather_per_city.csv');
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const locations = useMemo(() => {
    if (!cityData) return [];
    const coordsMap: Record<string, [number, number]> = {
      'Philadelphia': [39.9526, -75.1652],
      'Tucson': [32.2226, -110.9747], 
      'Tampa': [27.9506, -82.4572],
      'Indianapolis': [39.7684, -86.1581],
      'Nashville': [36.1627, -86.7816],
      'New Orleans': [29.9511, -90.0715]
    };
    const uniqueCities = Array.from(new Set(cityData.map(d => d.city).filter(Boolean)));
    return uniqueCities.map(c => ({
      name: String(c),
      position: coordsMap[String(c)] || [39.8283, -98.5795],
      data: cityData.filter(d => d.city === c)
    }));
  }, [cityData]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Breadcrumb items={[{ label: 'Insights' }, { label: 'Data Enrichment' }, { label: 'Weather-Mood Hypothesis' }]} />
      <div className="mt-8 mb-12">
        <h1 className="text-4xl font-display font-bold text-gray-900">The Weather-Mood Hypothesis</h1>
        <p className="mt-4 text-xl text-gray-600 max-w-3xl">Does raining ruin a restaurant's rating? Explore correlations between historical weather patterns and review sentiments.</p>
      </div>
      <div className="mb-16 bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col z-0">
         <h2 className="text-2xl font-bold mb-4">Interactive City Real-time Weather Map</h2>
         <p className="mb-4 text-gray-600">Select a city from the map below to load weather correlation datacards.</p>
         <div className="flex flex-col lg:flex-row gap-6 h-full relative z-0">
            <div className="w-full lg:w-2/3">
               <CityMapWithData locations={locations} onCityClick={(city) => setSelectedCity(city)} />
            </div>
            <div className="w-full lg:w-1/3">
               {selectedCity ? (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 h-full overflow-y-auto max-h-96">
                     <h3 className="text-xl font-bold text-blue-900 mb-2">{selectedCity.name} Metrics</h3>
                     <p className="text-sm text-blue-700 mb-4 cursor-pointer hover:underline" onClick={() => setSelectedCity(null)}>Back to map</p>
                     <div className="mt-4 space-y-4">
                        {selectedCity.data.map((d: any, i: number) => (
                           <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                             <div className="text-sm text-gray-500 font-semibold uppercase tracking-wide mb-1">{d.weather_condition || 'Normal'} Weather</div>
                             <div className="text-3xl font-display text-gray-900 flex justify-between items-center w-full">
                                <span>{Number(d.avg_rating || 0).toFixed(2)}</span>
                                <span className="text-yelp-red text-2xl">★</span> 
                             </div>
                             <div className="mt-2 text-xs text-gray-400 border-t pt-2 w-full flex justify-between">
                               <span>Volume:</span>
                               <span>{d.total_reviews} reviews</span>
                             </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ) : (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-full flex flex-col items-center justify-center text-gray-500 min-h-[24rem]">
                     <p className="text-center">Select a location marker on the map to inspect granular environmental attribution data.</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
export default WeatherMood;
;
fs.writeFileSync('src/pages/insights/WeatherMood.tsx', weatherTemplate);
