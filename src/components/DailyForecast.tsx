import { useState } from 'react';
import { Calendar, Droplets, ChevronDown, ChevronUp, Wind, Sunrise, Sunset, Clock, Sun } from 'lucide-react';
import { DailyForecastItem, UnitSystem } from '../types';
import { 
  interpretWeatherCode, 
  formatTemp, 
  formatSpeed, 
  formatPrecipitation, 
  getWindCompass,
  getUvCategory,
  formatDaylight 
} from '../services/weatherInterpreter';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastProps {
  items: DailyForecastItem[];
  unit: UnitSystem;
}

export function DailyForecast({ items, unit }: DailyForecastProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(items[0]?.date || null);

  // Find global min and max across all 7 days for normalized temperature bars
  const minAll = Math.min(...items.map((i) => i.tempMin));
  const maxAll = Math.max(...items.map((i) => i.tempMax));
  const tempSpan = Math.max(maxAll - minAll, 1);

  const formatSunTime = (timeStr?: string) => {
    if (!timeStr) return '--:--';
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider font-display">
            7-Day Synoptic Outlook
          </h3>
        </div>
        <span className="text-xs text-neutral-500">Click any day to expand telemetry</span>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl divide-y divide-neutral-800/80 overflow-hidden">
        {items.map((day, idx) => {
          const condition = interpretWeatherCode(day.weatherCode, true);
          const isExpanded = expandedDate === day.date;
          const uvInfo = getUvCategory(day.uvIndexMax);
          const dominantCompass = getWindCompass(day.windDirectionDominant);

          // Calculate bar offsets (percent)
          const leftPercent = ((day.tempMin - minAll) / tempSpan) * 100;
          const widthPercent = Math.max(((day.tempMax - day.tempMin) / tempSpan) * 100, 8);

          return (
            <div key={day.date} className="transition-colors">
              <button
                type="button"
                id={`daily-forecast-item-${idx}`}
                onClick={() => setExpandedDate(isExpanded ? null : day.date)}
                className="w-full text-left p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-800/40 focus:outline-none"
              >
                {/* Day & Condition */}
                <div className="flex items-center gap-3 sm:w-48">
                  <span className="text-sm font-semibold text-neutral-100 w-24 shrink-0 font-display">
                    {day.displayDay}
                  </span>
                  <div className="flex items-center gap-2">
                    <WeatherIcon name={condition.iconName} className="w-5 h-5 shrink-0 text-sky-400" />
                    <span className="text-xs text-neutral-300 truncate max-w-[110px]">
                      {condition.label}
                    </span>
                  </div>
                </div>

                {/* Rain Chance */}
                <div className="flex items-center gap-1.5 text-xs text-cyan-400 sm:w-20">
                  {day.precipitationProbabilityMax > 10 ? (
                    <>
                      <Droplets className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-mono">{day.precipitationProbabilityMax}%</span>
                    </>
                  ) : (
                    <span className="text-neutral-500 font-mono text-xs">--</span>
                  )}
                </div>

                {/* Min - Bar - Max */}
                <div className="flex items-center gap-3 flex-1 max-w-xs">
                  <span className="text-xs font-mono text-neutral-400 w-8 text-right shrink-0">
                    {formatTemp(day.tempMin, unit)}
                  </span>

                  {/* Relative temperature range bar */}
                  <div className="flex-1 bg-neutral-800 h-2 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400 opacity-90"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-mono font-bold text-neutral-100 w-8 shrink-0">
                    {formatTemp(day.tempMax, unit)}
                  </span>
                </div>

                {/* Chevron */}
                <div className="hidden sm:block text-neutral-500">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-sky-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 hover:text-neutral-300" />
                  )}
                </div>
              </button>

              {/* Expandable Synoptic Inspection Drawer */}
              {isExpanded && (
                <div className="bg-neutral-950/70 px-4 sm:px-6 py-4 border-t border-neutral-800/80 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {/* Thermal Range */}
                    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 space-y-1">
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Thermal Envelope</span>
                      </div>
                      <div className="text-sm font-bold text-neutral-100 font-mono">
                        {formatTemp(day.tempMin, unit)} → {formatTemp(day.tempMax, unit)}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Feels: {formatTemp(day.apparentTempMin, unit)} to {formatTemp(day.apparentTempMax, unit)}
                      </div>
                    </div>

                    {/* Wind Dynamics */}
                    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 space-y-1">
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-sky-400" />
                        <span>Wind Dynamics</span>
                      </div>
                      <div className="text-sm font-bold text-neutral-100 font-mono">
                        {formatSpeed(day.windSpeedMax, unit)} {dominantCompass.text}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Peak Gusts: {formatSpeed(day.windGustsMax, unit)}
                      </div>
                    </div>

                    {/* Precipitation Total */}
                    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 space-y-1">
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Precipitation Volume</span>
                      </div>
                      <div className="text-sm font-bold text-cyan-400 font-mono">
                        {formatPrecipitation(day.precipitationSum, unit)}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Peak probability: {day.precipitationProbabilityMax}%
                      </div>
                    </div>

                    {/* Daylight Duration & UV */}
                    <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 space-y-1">
                      <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Daylight & Solar</span>
                      </div>
                      <div className="text-sm font-bold text-neutral-100 font-mono">
                        {formatDaylight(day.daylightDuration)}
                      </div>
                      <div className={`text-[10px] font-semibold ${uvInfo.color}`}>
                        UV Index Max: {Math.round(day.uvIndexMax)} ({uvInfo.label})
                      </div>
                    </div>
                  </div>

                  {/* Dawn & Dusk timestamps for the day */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-3 pt-2.5 border-t border-neutral-800/60">
                    <span className="flex items-center gap-1.5">
                      <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                      Sunrise: <strong className="text-neutral-300 font-mono">{formatSunTime(day.sunrise)}</strong>
                    </span>
                    <span>General Weather: <strong className="text-neutral-300">{condition.description}</strong></span>
                    <span className="flex items-center gap-1.5">
                      Sunset: <strong className="text-neutral-300 font-mono">{formatSunTime(day.sunset)}</strong>
                      <Sunset className="w-3.5 h-3.5 text-orange-400" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

