import { 
  Wind, 
  Droplets, 
  Sun, 
  Gauge, 
  Cloud, 
  CloudRain, 
  Eye,
  ThermometerSnowflake,
  TrendingUp,
  TrendingDown,
  Minus,
  Compass
} from 'lucide-react';
import { WeatherData, UnitSystem } from '../types';
import { 
  getWindCompass, 
  getUvCategory, 
  getHumidityDescription, 
  formatSpeed, 
  formatPressure,
  formatPrecipitation,
  formatVisibility,
  getDewPointDescription,
  getBeaufortScale,
  formatTemp
} from '../services/weatherInterpreter';

interface AtmosphericMetricsProps {
  data: WeatherData;
  unit: UnitSystem;
}

export function AtmosphericMetrics({ data, unit }: AtmosphericMetricsProps) {
  const { current, daily } = data;
  const today = daily[0];
  const windCompass = getWindCompass(current.windDirection);
  const beaufort = getBeaufortScale(current.windSpeed);
  const uvInfo = getUvCategory(today?.uvIndexMax ?? 0);
  const visibility = formatVisibility(current.visibility, unit);
  const dewPointComfort = getDewPointDescription(current.dewPoint);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider font-display">
            Atmospheric Telemetry & Sensors
          </h3>
        </div>
        <span className="text-xs text-neutral-400 font-mono">8 Primary Sensors Online</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* 1. Wind & Beaufort Scale */}
        <div 
          id="metric-wind"
          className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Wind Velocity</span>
            <Wind className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-neutral-100 font-display font-mono">
              {formatSpeed(current.windSpeed, unit)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-300 mt-1">
              <Compass 
                className="w-3.5 h-3.5 text-sky-400 transition-transform duration-500" 
                style={{ transform: `rotate(${current.windDirection}deg)` }} 
              />
              <span className="font-semibold text-neutral-200">{windCompass.text}</span>
              <span className="text-[11px] text-neutral-400">({current.windDirection}°)</span>
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 flex items-center justify-between">
            <span>Force {beaufort.force} • {beaufort.name}</span>
            <span className="text-neutral-400">Gust {formatSpeed(current.windGusts, unit)}</span>
          </div>
        </div>

        {/* 2. Barometric Pressure & 3h Tendency */}
        <div 
          id="metric-pressure"
          className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Barometric Tendency</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-neutral-100 font-display font-mono">
                {formatPressure(current.pressure, unit)}
              </span>
              <span className="text-xs flex items-center gap-1 font-semibold text-neutral-300">
                {current.pressureTendency === 'rising' && (
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Rising
                  </span>
                )}
                {current.pressureTendency === 'falling' && (
                  <span className="text-rose-400 flex items-center gap-0.5">
                    <TrendingDown className="w-3.5 h-3.5" /> Falling
                  </span>
                )}
                {current.pressureTendency === 'steady' && (
                  <span className="text-neutral-400 flex items-center gap-0.5">
                    <Minus className="w-3.5 h-3.5" /> Steady
                  </span>
                )}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              MSL {formatPressure(current.pressure, unit)} • Surface {Math.round(current.surfacePressure)} hPa
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2">
            {current.pressure >= 1013 ? 'High pressure isobaric ridge' : 'Low pressure trough active'}
          </div>
        </div>

        {/* 3. Humidity */}
        <div 
          id="metric-humidity"
          className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Relative Humidity</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-neutral-100 font-display font-mono">
              {current.humidity}%
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-cyan-400 h-full rounded-full transition-all duration-700" 
                style={{ width: `${Math.min(current.humidity, 100)}%` }} 
              />
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 truncate">
            {getHumidityDescription(current.humidity)}
          </div>
        </div>

        {/* 4. Dew Point & Condensation */}
        <div 
          id="metric-dewpoint"
          className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Dew Point</span>
            <ThermometerSnowflake className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-neutral-100 font-display font-mono">
              {formatTemp(current.dewPoint, unit)}
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              {dewPointComfort.label}
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 truncate">
            {dewPointComfort.comfort}
          </div>
        </div>

        {/* 5. Visibility (Aviation Standard) */}
        <div 
          id="metric-visibility"
          className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Atmospheric Visibility</span>
            <Eye className="w-4 h-4 text-teal-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-neutral-100 font-display font-mono">
              {visibility.value}
            </div>
            <p className="text-xs text-neutral-300 mt-1 font-semibold">
              {visibility.label}
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 truncate">
            Aviation visual range index
          </div>
        </div>

        {/* 6. UV Index */}
        <div 
          id="metric-uv"
          className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Solar UV Index</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-neutral-100 font-display font-mono">
                {today?.uvIndexMax ? Math.round(today.uvIndexMax) : 0}
              </span>
              <span className={`text-xs font-semibold ${uvInfo.color}`}>
                {uvInfo.label}
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-700" 
                style={{ width: `${Math.min(((today?.uvIndexMax ?? 0) / 12) * 100, 100)}%` }} 
              />
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 truncate" title={uvInfo.advice}>
            {uvInfo.advice}
          </div>
        </div>

        {/* 7. Cloud Coverage */}
        <div 
          id="metric-clouds"
          className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Cloud Density</span>
            <Cloud className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-neutral-100 font-display font-mono">
              {current.cloudCover}%
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-slate-400 h-full rounded-full transition-all duration-700" 
                style={{ width: `${current.cloudCover}%` }} 
              />
            </div>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2 truncate">
            {current.cloudCover < 20 ? 'Clear sky ceiling' : current.cloudCover < 60 ? 'Scattered stratocumulus' : 'Heavy overcast deck'}
          </div>
        </div>

        {/* 8. Precipitation */}
        <div 
          id="metric-precipitation"
          className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium uppercase tracking-wider">Precipitation Accum.</span>
            <CloudRain className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <div className="text-xl font-bold text-neutral-100 font-display font-mono">
              {formatPrecipitation(current.precipitation, unit)}
            </div>
            <p className="text-xs text-neutral-300 mt-1">
              Rain peak: {today?.precipitationProbabilityMax ?? 0}% probability
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 border-t border-neutral-800/80 pt-2">
            24h sum: {formatPrecipitation(today?.precipitationSum ?? 0, unit)}
          </div>
        </div>
      </div>
    </div>
  );
}

