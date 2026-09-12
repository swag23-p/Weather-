import { useState, useId, useMemo } from 'react';
import { HourlyForecastItem, UnitSystem } from '../types';
import { formatTemp, formatSpeed, getWindCompass, interpretWeatherCode } from '../services/weatherInterpreter';
import { WeatherIcon } from './WeatherIcon';
import { Activity, Droplets, Wind, Eye } from 'lucide-react';

interface MeteogramProps {
  items: HourlyForecastItem[];
  unit: UnitSystem;
}

export function Meteogram({ items, unit }: MeteogramProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const gradientId = useId();

  // Limit to 24 hours
  const hours = useMemo(() => items.slice(0, 24), [items]);

  // Compute temperature boundaries
  const temps = hours.map((h) => h.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempRange = Math.max(maxTemp - minTemp, 4);

  // SVG dimensions
  const svgWidth = 840;
  const svgHeight = 180;
  const paddingX = 35;
  const paddingTop = 30;
  const paddingBottom = 40;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const chartWidth = svgWidth - paddingX * 2;

  // Generate coordinate points for each hour
  const points = useMemo(() => {
    return hours.map((h, idx) => {
      const x = paddingX + (idx / (hours.length - 1)) * chartWidth;
      // Invert Y: higher temperature is near top
      const normalizedTemp = (h.temperature - minTemp) / tempRange;
      const y = paddingTop + (1 - normalizedTemp) * chartHeight;
      return { x, y, hour: h, idx };
    });
  }, [hours, minTemp, tempRange, chartWidth, chartHeight]);

  // Generate smooth SVG path (Cubic Bezier curve)
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [points]);

  // Area under the curve
  const areaD = useMemo(() => {
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    const bottomY = svgHeight - paddingBottom;
    return `${pathD} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [pathD, points, svgHeight, paddingBottom]);

  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : points[0];
  const activeCondition = activePoint ? interpretWeatherCode(activePoint.hour.weatherCode, activePoint.hour.isDay) : null;
  const activeCompass = activePoint ? getWindCompass(activePoint.hour.windDirection) : null;

  return (
    <div id="interactive-meteogram" className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header bar with live scrub telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider font-display">
              Synoptic 24h Meteogram
            </h3>
            <p className="text-[11px] text-neutral-400">
              Interactive temperature spline & precipitation volume
            </p>
          </div>
        </div>

        {/* Live Scrubber Readout Badge */}
        {activePoint && (
          <div className="flex items-center gap-3 bg-neutral-800/80 border border-neutral-700/80 px-3 py-1 rounded-xl text-xs">
            <span className="font-semibold text-sky-300 font-mono">
              {activePoint.hour.displayHour}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="font-bold text-neutral-100 font-mono">
              {formatTemp(activePoint.hour.temperature, unit)}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Droplets className="w-3 h-3" />
              {activePoint.hour.precipitationProbability}%
            </span>
            <span className="hidden sm:inline text-neutral-500">•</span>
            <span className="hidden sm:flex items-center gap-1 text-neutral-300">
              <Wind className="w-3 h-3 text-sky-400" />
              {formatSpeed(activePoint.hour.windSpeed, unit)} {activeCompass?.text}
            </span>
          </div>
        )}
      </div>

      {/* Meteogram Chart Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-44 sm:h-52 overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
          onTouchEnd={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={`${gradientId}-temp`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#0284c7" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </linearGradient>

            <linearGradient id={`${gradientId}-rain`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Horizontal Reference Grid Lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={svgWidth - paddingX}
            y2={paddingTop}
            stroke="#262626"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={paddingTop + chartHeight / 2}
            x2={svgWidth - paddingX}
            y2={paddingTop + chartHeight / 2}
            stroke="#262626"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1={paddingX}
            y1={svgHeight - paddingBottom}
            x2={svgWidth - paddingX}
            y2={svgHeight - paddingBottom}
            stroke="#404040"
            strokeWidth="1"
          />

          {/* Precipitation Probability Bars at bottom */}
          {points.map((p) => {
            const barMaxH = 30;
            const barH = (p.hour.precipitationProbability / 100) * barMaxH;
            const barY = svgHeight - paddingBottom - barH;
            const barW = Math.max(chartWidth / hours.length - 4, 6);

            if (p.hour.precipitationProbability <= 0) return null;

            return (
              <g key={`bar-${p.idx}`}>
                <rect
                  x={p.x - barW / 2}
                  y={barY}
                  width={barW}
                  height={barH}
                  fill={`url(#${gradientId}-rain)`}
                  rx="1.5"
                />
              </g>
            );
          })}

          {/* Area Fill under Temperature curve */}
          <path d={areaD} fill={`url(#${gradientId}-temp)`} />

          {/* Spline Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hour X-Axis Labels and vertical tick marks */}
          {points.map((p, i) => {
            // Show label every 3 hours or at endpoints
            const isLabeled = i === 0 || i === points.length - 1 || i % 3 === 0;
            return (
              <g key={`tick-${i}`}>
                {isLabeled && (
                  <>
                    <line
                      x1={p.x}
                      y1={svgHeight - paddingBottom}
                      x2={p.x}
                      y2={svgHeight - paddingBottom + 5}
                      stroke="#525252"
                      strokeWidth="1"
                    />
                    <text
                      x={p.x}
                      y={svgHeight - paddingBottom + 18}
                      textAnchor="middle"
                      fill="#a3a3a3"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      {p.hour.displayHour}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Interactive Temperature points */}
          {points.map((p, i) => {
            const isHovered = hoverIndex === i;
            return (
              <g key={`point-${i}`}>
                {/* Visual Circle on Line */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 5 : 2.5}
                  fill={isHovered ? '#ffffff' : '#38bdf8'}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-all duration-150 pointer-events-none"
                />

                {/* Invisible hit test column */}
                <rect
                  x={p.x - chartWidth / (hours.length * 2)}
                  y={0}
                  width={chartWidth / hours.length}
                  height={svgHeight}
                  fill="transparent"
                  className="cursor-crosshair"
                  onMouseEnter={() => setHoverIndex(i)}
                  onTouchMove={() => setHoverIndex(i)}
                />
              </g>
            );
          })}

          {/* Active Crosshair Line */}
          {activePoint && hoverIndex !== null && (
            <g pointerEvents="none">
              <line
                x1={activePoint.x}
                y1={paddingTop - 10}
                x2={activePoint.x}
                y2={svgHeight - paddingBottom}
                stroke="#38bdf8"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              {/* Temperature text badge above the point */}
              <rect
                x={activePoint.x - 22}
                y={activePoint.y - 25}
                width="44"
                height="18"
                rx="4"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="1"
              />
              <text
                x={activePoint.x}
                y={activePoint.y - 13}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {formatTemp(activePoint.hour.temperature, unit)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Selected Hour Detailed Inspector */}
      {activePoint && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 pt-1 border-t border-neutral-800/60">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
            {activeCondition && (
              <WeatherIcon name={activeCondition.iconName} className="w-5 h-5 text-sky-400 shrink-0" />
            )}
            <div className="truncate">
              <div className="text-[10px] text-neutral-400">Condition</div>
              <div className="text-xs font-semibold text-neutral-200 truncate">
                {activeCondition?.label}
              </div>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
            <div className="text-[10px] text-neutral-400">Feels Like</div>
            <div className="text-xs font-bold text-neutral-200 font-mono">
              {formatTemp(activePoint.hour.apparentTemperature, unit)}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
            <div className="text-[10px] text-neutral-400">Dew Point</div>
            <div className="text-xs font-bold text-neutral-200 font-mono">
              {formatTemp(activePoint.hour.dewPoint, unit)}
            </div>
          </div>

          <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
            <div className="text-[10px] text-neutral-400">Precipitation</div>
            <div className="text-xs font-bold text-cyan-400 font-mono">
              {activePoint.hour.precipitationProbability}% ({activePoint.hour.precipitation.toFixed(1)} mm)
            </div>
          </div>

          <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
            <div className="text-[10px] text-neutral-400">Wind & Gusts</div>
            <div className="text-xs font-bold text-neutral-200 font-mono">
              {formatSpeed(activePoint.hour.windSpeed, unit)} ({formatSpeed(activePoint.hour.windGusts, unit)})
            </div>
          </div>

          <div className="p-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
            <div className="text-[10px] text-neutral-400">Atmospheric Press.</div>
            <div className="text-xs font-bold text-neutral-200 font-mono">
              {Math.round(activePoint.hour.pressure)} hPa
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
