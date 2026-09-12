import { MapPin, ArrowUp, ArrowDown, Sparkles, Navigation, Gauge, Droplets, Eye } from 'lucide-react';
import { WeatherData, UnitSystem } from '../types';
import { 
  interpretWeatherCode, 
  formatTemp, 
  formatSpeed, 
  formatPressure, 
  formatVisibility,
  getWindCompass 
} from '../services/weatherInterpreter';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: UnitSystem;
}

export function CurrentWeather({ data, unit }: CurrentWeatherProps) {
  const { current, location, daily, updatedAt, elevation, timezone } = data;
  const condition = interpretWeatherCode(current.weatherCode, current.isDay);
  const todayForecast = daily[0];
  const windCompass = getWindCompass(current.windDirection);
  const visibility = formatVisibility(current.visibility, unit);

  // Formatted coordinates string
  const latFormatted = `${Math.abs(location.latitude).toFixed(2)}°${location.latitude >= 0 ? 'N' : 'S'}`;
  const lonFormatted = `${Math.abs(location.longitude).toFixed(2)}°${location.longitude >= 0 ? 'E' : 'W'}`;

  return (
    <div
      id="current-weather-card"
      className={`relative overflow-hidden rounded-2xl border ${condition.accentBorder} bg-gradient-to-br ${condition.themeGradient} p-6 sm:p-8 backdrop-blur-xl transition-all shadow-xl`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Location & Condition text */}
        <div className="space-y-3.5">
          {/* Location Title & Coordinate telemetry */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-neutral-200 text-base font-semibold font-display">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                {location.name}
              </span>
              {(location.region || location.country) && (
                <span className="text-xs text-neutral-400">
                  • {[location.region, location.country].filter(Boolean).join(', ')}
                </span>
              )}
              {location.isDetectedGeo ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  GPS Sensor Fixed
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-800/80 text-neutral-300 border border-neutral-700">
                  Observatory
                </span>
              )}
            </div>

            {/* Coordinates & Elevation Pill */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-neutral-400">
              <span>{latFormatted}, {lonFormatted}</span>
              <span>•</span>
              <span>Elev. {elevation}m ASL</span>
              <span>•</span>
              <span>Zone: {timezone.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Condition Header */}
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-700/70 shadow-inner">
              <WeatherIcon name={condition.iconName} className="w-8 h-8 text-sky-400" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
                {condition.label}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300">
                {condition.description}
              </p>
            </div>
          </div>

          {/* Telemetry Micro-Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900/70 border border-neutral-700/60 text-neutral-300">
              <Navigation 
                className="w-3.5 h-3.5 text-sky-400" 
                style={{ transform: `rotate(${current.windDirection}deg)` }} 
              />
              <span>{formatSpeed(current.windSpeed, unit)} {windCompass.text}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900/70 border border-neutral-700/60 text-neutral-300">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dew: {formatTemp(current.dewPoint, unit)}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900/70 border border-neutral-700/60 text-neutral-300">
              <Eye className="w-3.5 h-3.5 text-teal-400" />
              <span>Vis: {visibility.value}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900/70 border border-neutral-700/60 text-neutral-300">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>{formatPressure(current.pressure, unit)}</span>
            </div>
          </div>
        </div>

        {/* Right: Big Temperature Display */}
        <div className="flex items-baseline md:items-end flex-col md:text-right">
          <div className="flex items-start">
            <span
              id="current-temp-value"
              className="text-6xl sm:text-7xl font-bold tracking-tighter text-white font-display font-mono"
            >
              {formatTemp(current.temperature, unit)}
            </span>
          </div>

          {/* Apparent Temp & High/Low */}
          <div className="flex items-center gap-3 mt-1 text-sm text-neutral-300">
            <span>Feels like {formatTemp(current.apparentTemperature, unit)}</span>
            {todayForecast && (
              <span className="flex items-center gap-2 text-xs font-mono text-neutral-400 border-l border-neutral-700 pl-3">
                <span className="flex items-center text-rose-400 font-semibold">
                  <ArrowUp className="w-3 h-3" />
                  {formatTemp(todayForecast.tempMax, unit)}
                </span>
                <span className="flex items-center text-sky-400 font-semibold">
                  <ArrowDown className="w-3 h-3" />
                  {formatTemp(todayForecast.tempMin, unit)}
                </span>
              </span>
            )}
          </div>

          {/* Detection Sync timestamp */}
          <div className="text-[11px] text-neutral-400 mt-2 font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Station Telemetry Synced: {updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

