import { useState, useEffect, useCallback } from 'react';
import { 
  WeatherData, 
  LocationInfo, 
  UnitSystem 
} from './types';
import { 
  fetchWeatherData, 
  reverseGeocode, 
  POPULAR_LOCATIONS 
} from './services/weatherService';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { AtmosphericMetrics } from './components/AtmosphericMetrics';
import { Meteogram } from './components/Meteogram';
import { AirQualityCard } from './components/AirQualityCard';
import { SolarMoonEphemeris } from './components/SolarMoonEphemeris';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { DetectionInsights } from './components/DetectionInsights';
import { Loader2, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  const [unit, setUnit] = useState<UnitSystem>(() => {
    const saved = localStorage.getItem('weather_unit');
    return saved === 'imperial' ? 'imperial' : 'metric';
  });

  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isDetectingGeo, setIsDetectingGeo] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const handleToggleUnit = (newUnit: UnitSystem) => {
    setUnit(newUnit);
    localStorage.setItem('weather_unit', newUnit);
  };

  // Load weather for a given location
  const loadWeatherForLocation = useCallback(async (loc: LocationInfo) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const data = await fetchWeatherData(loc);
      setWeatherData(data);
      setCurrentLocation(loc);
    } catch (err: unknown) {
      console.error('Failed to load weather:', err);
      const msg = err instanceof Error ? err.message : 'Unable to connect to meteorological stations';
      setWeatherError(msg);
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Detect location via GPS / Geolocation API
  const detectLocation = useCallback(async (silentFallback = false) => {
    if (!navigator.geolocation) {
      if (!silentFallback) {
        setGeoError('Geolocation hardware is not supported by your browser environment');
      }
      return;
    }

    setIsDetectingGeo(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const detectedLoc = await reverseGeocode(latitude, longitude);
          await loadWeatherForLocation(detectedLoc);
        } catch (err) {
          console.error('Reverse geocode error:', err);
          if (!silentFallback) {
            setGeoError('Could not resolve location coordinates');
          }
        } finally {
          setIsDetectingGeo(false);
        }
      },
      (error) => {
        setIsDetectingGeo(false);
        console.warn('Geolocation error:', error.message);
        if (!silentFallback) {
          if (error.code === error.PERMISSION_DENIED) {
            setGeoError('Location access was not granted by browser settings');
          } else {
            setGeoError('Position lookup timed out or was temporarily unavailable');
          }
        }
        // If initial load and geolocation failed, fallback to default city
        if (!weatherData) {
          loadWeatherForLocation(POPULAR_LOCATIONS[0]);
        }
      },
      { timeout: 7000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  }, [loadWeatherForLocation, weatherData]);

  // Initial mount: try to auto-detect location, or load default
  useEffect(() => {
    detectLocation(true);
    const timer = setTimeout(() => {
      if (!currentLocation && !weatherData) {
        loadWeatherForLocation(POPULAR_LOCATIONS[0]);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [detectLocation, currentLocation, weatherData, loadWeatherForLocation]);

  const handleRefresh = useCallback(() => {
    if (currentLocation) {
      loadWeatherForLocation(currentLocation);
    } else {
      detectLocation();
    }
  }, [currentLocation, loadWeatherForLocation, detectLocation]);

  // Global keyboard shortcuts: 'u' for unit toggle, 'r' for refresh, 'g' for gps, '/' for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        const searchInput = document.getElementById('location-search-input') as HTMLInputElement | null;
        searchInput?.focus();
      } else if (e.key.toLowerCase() === 'u' && !isInput) {
        e.preventDefault();
        handleToggleUnit(unit === 'metric' ? 'imperial' : 'metric');
      } else if (e.key.toLowerCase() === 'r' && !isInput) {
        e.preventDefault();
        handleRefresh();
      } else if (e.key.toLowerCase() === 'g' && !isInput) {
        e.preventDefault();
        detectLocation(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unit, handleRefresh, detectLocation]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-sky-500/20 selection:text-sky-200 font-sans">
      {/* App Header */}
      <Header
        currentLocation={currentLocation}
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onDetectLocation={() => detectLocation(false)}
        onRefresh={handleRefresh}
        isDetectingGeo={isDetectingGeo}
        isLoadingWeather={isLoadingWeather}
        geoError={geoError}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Search Bar & Quick Location Selector */}
        <section id="location-search-section">
          <SearchBar
            onSelectLocation={loadWeatherForLocation}
            currentLocation={currentLocation}
          />
        </section>

        {/* Loading State when no prior data exists */}
        {isLoadingWeather && !weatherData && (
          <div className="py-28 flex flex-col items-center justify-center gap-3 text-neutral-400">
            <Loader2 className="w-9 h-9 animate-spin text-sky-400" />
            <p className="text-sm font-semibold tracking-wide text-neutral-300 font-display">
              Interrogating atmospheric satellite and terrestrial sensors...
            </p>
            <span className="text-xs text-neutral-500 font-mono">Synchronizing WMO station network</span>
          </div>
        )}

        {/* Error State */}
        {weatherError && !weatherData && (
          <div className="p-8 rounded-2xl bg-neutral-900 border border-red-900/40 text-center space-y-4 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-neutral-200 font-display">
                Observatory Connection Interrupted
              </h3>
              <p className="text-xs text-neutral-400">{weatherError}</p>
            </div>
            <button
              id="retry-weather-btn"
              type="button"
              onClick={handleRefresh}
              className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold inline-flex items-center gap-2 border border-neutral-700 active:scale-95 transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Detection
            </button>
          </div>
        )}

        {/* Loaded Comprehensive Meteorological Dashboard View */}
        {weatherData && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Current Weather Hero Banner */}
            <section id="current-weather-section">
              <CurrentWeather data={weatherData} unit={unit} />
            </section>

            {/* 2. Meteorological Advisory & Detection Insights */}
            <section id="detection-insights-section">
              <DetectionInsights data={weatherData} />
            </section>

            {/* 3. Interactive 24-Hour Synoptic Meteogram */}
            <section id="meteogram-chart-section">
              <Meteogram items={weatherData.hourly} unit={unit} />
            </section>

            {/* 4. Atmospheric Telemetry & 8 Sensors Grid */}
            <section id="atmospheric-telemetry-section">
              <AtmosphericMetrics data={weatherData} unit={unit} />
            </section>

            {/* 5. Dual Environmental Panels: Air Quality & Solar/Moon Ephemeris */}
            <section id="environmental-ephemeris-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {weatherData.airQuality && (
                <div id="air-quality-container">
                  <AirQualityCard airQuality={weatherData.airQuality} />
                </div>
              )}
              {weatherData.solar && weatherData.moon && (
                <div id="solar-lunar-container">
                  <SolarMoonEphemeris solar={weatherData.solar} moon={weatherData.moon} />
                </div>
              )}
            </section>

            {/* 6. 24-Hour Hourly Timeline Strip */}
            <section id="hourly-forecast-section">
              <HourlyForecast items={weatherData.hourly} unit={unit} />
            </section>

            {/* 7. 7-Day Synoptic Outlook with Expandable Day Inspector */}
            <section id="daily-forecast-section">
              <DailyForecast items={weatherData.daily} unit={unit} />
            </section>
          </div>
        )}
      </main>

      {/* Professional Meteorological Observatory Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-6 text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="font-semibold text-neutral-400">Weather Detector Professional</span>
            <span>• High-Resolution Atmospheric Telemetry</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
            <span>Shortcuts: [/] Search • [U] Unit • [R] Refresh • [G] GPS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

