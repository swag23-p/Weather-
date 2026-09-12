import { Clock, Droplets } from 'lucide-react';
import { HourlyForecastItem, UnitSystem } from '../types';
import { interpretWeatherCode, formatTemp, formatSpeed } from '../services/weatherInterpreter';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  items: HourlyForecastItem[];
  unit: UnitSystem;
}

export function HourlyForecast({ items, unit }: HourlyForecastProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider font-display">
            24-Hour Forecast Timeline
          </h3>
        </div>
        <span className="text-xs text-neutral-500">Hourly Interval</span>
      </div>

      {/* Horizontal scroll container */}
      <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
        {items.map((hour, idx) => {
          const condition = interpretWeatherCode(hour.weatherCode, hour.isDay);
          const isCurrent = idx === 0;

          return (
            <div
              key={`${hour.time}-${idx}`}
              id={`hourly-item-${idx}`}
              className={`flex-none w-24 p-3 rounded-xl border flex flex-col items-center justify-between transition-all ${
                isCurrent
                  ? 'bg-sky-500/10 border-sky-500/30 text-white'
                  : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              {/* Hour Label */}
              <span className={`text-xs font-semibold ${isCurrent ? 'text-sky-300' : 'text-neutral-400'}`}>
                {hour.displayHour}
              </span>

              {/* Icon */}
              <div className="my-2.5">
                <WeatherIcon name={condition.iconName} className="w-6 h-6" />
              </div>

              {/* Temp */}
              <span className="text-sm font-bold text-neutral-100 font-display">
                {formatTemp(hour.temperature, unit)}
              </span>

              {/* Rain Probability */}
              <div className="mt-2 flex items-center gap-1 text-[11px] text-cyan-400">
                <Droplets className="w-3 h-3 shrink-0" />
                <span>{hour.precipitationProbability}%</span>
              </div>

              {/* Wind */}
              <span className="text-[10px] text-neutral-400 mt-1">
                {formatSpeed(hour.windSpeed, unit)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
