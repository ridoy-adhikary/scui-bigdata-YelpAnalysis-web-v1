import { useEffect, useMemo, useState } from 'react';
import AnalysisPage from '../../components/analysis/AnalysisPage';
import CityMapWithData from '../../components/maps/CityMapWithData';
import { insightAnalysisConfigs } from '../../data/analysisDatasets';
import { useCsvData } from '../../hooks/useCsvData';

export default function WeatherMood() {
  const { data: cityData } = useCsvData<Record<string, unknown>>('/data/data-enrichment/weather-mood/04_avg_rating_by_weather_per_city.csv');
  const [selectedCity, setSelectedCity] = useState<{ name: string; position: [number, number]; data?: Record<string, unknown>[] } | null>(null);

  const cityColumnKey = useMemo(() => {
    const sample = cityData[0];
    if (!sample) return 'weather_city';

    const key = Object.keys(sample).find((column) =>
      column.replace(/^\uFEFF/, '').toLowerCase() === 'weather_city'
    );

    return key ?? 'weather_city';
  }, [cityData]);

  const locations = useMemo(() => {
    const coordsMap: Record<string, [number, number]> = {
      Philadelphia: [39.9526, -75.1652],
      Tucson: [32.2226, -110.9747],
      Tampa: [27.9506, -82.4572],
      Indianapolis: [39.7684, -86.1581],
      Nashville: [36.1627, -86.7816],
      'New Orleans': [29.9511, -90.0715],
    };

    const byCity = new Map<string, Record<string, unknown>[]>();
    cityData.forEach((row) => {
      const cityName = String(row[cityColumnKey] ?? row.weather_city ?? row.city ?? '').trim();
      if (!cityName) return;
      const current = byCity.get(cityName) ?? [];
      current.push(row);
      byCity.set(cityName, current);
    });

    return Array.from(byCity.entries()).map(([cityName, rows]) => ({
      name: cityName,
      position: coordsMap[cityName] ?? [39.8283, -98.5795],
      data: rows,
    }));
  }, [cityColumnKey, cityData]);

  const cityOptions = useMemo(() => locations.map((item) => item.name).sort((a, b) => a.localeCompare(b)), [locations]);

  useEffect(() => {
    if (!selectedCity && locations.length > 0) {
      setSelectedCity(locations[0]);
    }
  }, [locations, selectedCity]);

  const activeCity = selectedCity ?? locations[0] ?? null;
  const mapLocations = locations;

  return (
    <AnalysisPage
      title="The Weather-Mood Hypothesis"
      description="Study weather-driven changes in ratings, check-ins, and category behavior using map-based city cards and complete weather-mood CSV analytics."
      breadcrumb={[
        { label: 'Insights' },
        { label: 'Data Enrichment' },
        { label: 'Weather-Mood Hypothesis' },
      ]}
      datasets={insightAnalysisConfigs.weatherMood}
      topContent={
        <section className="mb-10 bg-white p-6 rounded-xl shadow border border-gray-100">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Interactive City Map</h2>
          <p className="text-gray-600 mb-5">Select a city to focus both the map and the weather summary cards.</p>

          <div className="mb-5">
            <label htmlFor="weather-city-select" className="block text-sm font-medium text-gray-700 mb-2">
              Choose City
            </label>
            <select
              id="weather-city-select"
              className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yelp-red"
              value={activeCity?.name ?? ''}
              onChange={(event) => {
                const picked = locations.find((item) => item.name === event.target.value) ?? null;
                setSelectedCity(picked);
              }}
            >
              {cityOptions.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <CityMapWithData
                locations={mapLocations}
                onCityClick={(city) => setSelectedCity(city)}
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[380px]">
              {activeCity ? (
                <>
                  <h3 className="text-lg font-display font-bold text-gray-900">{activeCity.name}</h3>

                  <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto">
                    {(activeCity.data ?? []).slice(0, 8).map((row, index) => (
                      <div key={`${activeCity.name}-${index}`} className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="text-xs uppercase tracking-wide text-gray-500">
                          {String(row.weather_condition ?? 'Normal weather')}
                        </div>
                        <div className="mt-1 text-2xl font-display font-bold text-gray-900">
                          {Number(row.avg_rating ?? 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Total reviews: {String(row.total_reviews ?? 'N/A')}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm text-center">
                  No city data is available in the dataset.
                </div>
              )}
            </div>
          </div>
        </section>
      }
    />
  );
}
