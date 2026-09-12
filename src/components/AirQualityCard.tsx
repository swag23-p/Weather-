import { AirQualityMetrics } from '../types';
import { Wind, ShieldAlert, Sparkles, Activity } from 'lucide-react';

interface AirQualityCardProps {
  airQuality?: AirQualityMetrics;
}

export function AirQualityCard({ airQuality }: AirQualityCardProps) {
  if (!airQuality) return null;

  // Maximum scale for visual bar (US AQI up to 300)
  const aqiScore = airQuality.usAqi;
  const clampedPercent = Math.min((aqiScore / 300) * 100, 100);

  return (
    <div id="air-quality-card" className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider font-display">
              Air Quality Index (AQI)
            </h3>
            <p className="text-[11px] text-neutral-400">EPA Standard Real-Time Atmosphere Analysis</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-neutral-800/90 ${airQuality.color} border-neutral-700`}>
          {airQuality.label}
        </span>
      </div>

      {/* Main Gauge & Value */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex items-baseline gap-3 md:border-r border-neutral-800/80 md:pr-4">
          <span className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-100 font-display">
            {aqiScore}
          </span>
          <div>
            <div className="text-xs font-semibold uppercase text-neutral-300">US AQI</div>
            <div className="text-[11px] text-neutral-500">EU: {airQuality.europeanAqi}</div>
          </div>
        </div>

        {/* Multi-Spectrum Bar */}
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
            <span>Good (0)</span>
            <span>Moderate (50)</span>
            <span>Unhealthy (150)</span>
            <span>Hazardous (300+)</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-neutral-800 relative overflow-hidden flex">
            <div className="h-full w-1/6 bg-emerald-500" />
            <div className="h-full w-1/6 bg-yellow-500" />
            <div className="h-full w-1/6 bg-orange-500" />
            <div className="h-full w-1/6 bg-red-500" />
            <div className="h-full w-1/6 bg-purple-500" />
            <div className="h-full w-1/6 bg-rose-900" />
            {/* Indicator Needle */}
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-white border border-neutral-900 shadow-md transition-all duration-700"
              style={{ left: `calc(${clampedPercent}% - 3px)` }}
            />
          </div>
          <p className="text-xs text-neutral-300 pt-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{airQuality.advice}</span>
          </p>
        </div>
      </div>

      {/* Pollutant Micro-Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-800/60">
        <div className="bg-neutral-800/40 border border-neutral-700/40 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>PM2.5</span>
            <span className="text-[10px] font-mono text-neutral-500">µg/m³</span>
          </div>
          <div className="text-base font-bold text-neutral-100 font-mono mt-0.5">
            {airQuality.pm2_5}
          </div>
          <div className="text-[10px] text-neutral-400">Fine inhalable particles</div>
        </div>

        <div className="bg-neutral-800/40 border border-neutral-700/40 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>PM10</span>
            <span className="text-[10px] font-mono text-neutral-500">µg/m³</span>
          </div>
          <div className="text-base font-bold text-neutral-100 font-mono mt-0.5">
            {airQuality.pm10}
          </div>
          <div className="text-[10px] text-neutral-400">Coarse particulate matter</div>
        </div>

        <div className="bg-neutral-800/40 border border-neutral-700/40 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>NO₂</span>
            <span className="text-[10px] font-mono text-neutral-500">µg/m³</span>
          </div>
          <div className="text-base font-bold text-neutral-100 font-mono mt-0.5">
            {airQuality.no2}
          </div>
          <div className="text-[10px] text-neutral-400">Nitrogen dioxide</div>
        </div>

        <div className="bg-neutral-800/40 border border-neutral-700/40 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>O₃ Ozone</span>
            <span className="text-[10px] font-mono text-neutral-500">µg/m³</span>
          </div>
          <div className="text-base font-bold text-neutral-100 font-mono mt-0.5">
            {airQuality.o3}
          </div>
          <div className="text-[10px] text-neutral-400">Ground-level ozone</div>
        </div>
      </div>
    </div>
  );
}
