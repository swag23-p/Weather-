import { SolarEphemeris, MoonEphemeris } from '../types';
import { Sunrise, Sunset, Clock, Moon, Sparkles } from 'lucide-react';

interface SolarMoonEphemerisProps {
  solar: SolarEphemeris;
  moon: MoonEphemeris;
}

export function SolarMoonEphemeris({ solar, moon }: SolarMoonEphemerisProps) {
  const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const progress = Math.min(Math.max(solar.solarProgressPercent, 0), 100);
  const isDaytime = progress > 0 && progress < 100;

  return (
    <div id="solar-lunar-ephemeris" className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* 1. Solar Arc Card */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sunrise className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider font-display">
                Solar Cycle & Daylight
              </h3>
              <p className="text-[11px] text-neutral-400">Daylight: {solar.daylightDurationFormatted}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            {isDaytime ? `${progress}% of Day` : progress === 100 ? 'Night Cycle' : 'Pre-Dawn'}
          </span>
        </div>

        {/* Solar Path SVG Arc */}
        <div className="relative py-2 px-4">
          <svg viewBox="0 0 300 110" className="w-full h-24 overflow-visible">
            {/* Horizon line */}
            <line x1="20" y1="95" x2="280" y2="95" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 3" />

            {/* Elliptical Solar Arc Path */}
            <path
              d="M 30 95 A 120 75 0 0 1 270 95"
              fill="none"
              stroke="#1e293b"
              strokeWidth="3"
            />
            {/* Traveled arc path */}
            <path
              d="M 30 95 A 120 75 0 0 1 270 95"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeDasharray="380"
              strokeDashoffset={380 - (380 * (progress / 100))}
              strokeLinecap="round"
            />

            {/* Sun position marker on arc */}
            {isDaytime && (
              <g
                style={{
                  transform: `translate(${30 + (progress / 100) * 240}px, ${
                    95 - Math.sin((progress / 100) * Math.PI) * 75
                  }px)`,
                }}
              >
                <circle r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                <circle r="12" fill="#fbbf24" opacity="0.25" className="animate-pulse" />
              </g>
            )}
          </svg>
        </div>

        {/* Sunrise & Sunset readouts */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-xs">
          <div className="flex items-center gap-2">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-neutral-400">Sunrise</div>
              <div className="font-semibold text-neutral-200 font-mono">
                {formatTime(solar.sunrise)}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] text-neutral-400">Total Hours</div>
            <div className="font-semibold text-neutral-300 font-mono">
              {solar.daylightDurationFormatted}
            </div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-[10px] text-neutral-400">Sunset</div>
              <div className="font-semibold text-neutral-200 font-mono">
                {formatTime(solar.sunset)}
              </div>
            </div>
            <Sunset className="w-4 h-4 text-orange-400" />
          </div>
        </div>
      </div>

      {/* 2. Moon Ephemeris Card */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider font-display">
                Lunar Phase & Cycle
              </h3>
              <p className="text-[11px] text-neutral-400">Synodic Month: Day {moon.moonAgeDays} of 29.5</p>
            </div>
          </div>
          <span className="text-xs font-mono text-indigo-300 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            {moon.illumination}% Illumination
          </span>
        </div>

        {/* Visual Moon Disk */}
        <div className="flex items-center justify-around py-2">
          {/* Moon Visual Globe */}
          <div className="relative w-16 h-16 rounded-full bg-neutral-950 border border-neutral-700/80 shadow-inner flex items-center justify-center overflow-hidden">
            {/* Crater pattern texture */}
            <div className="absolute inset-0 bg-radial from-neutral-800 to-neutral-950 opacity-90" />
            <div
              className="absolute inset-0 bg-neutral-200 transition-all duration-500 opacity-90"
              style={{
                clipPath:
                  moon.phaseCode === 'full'
                    ? 'none'
                    : moon.phaseCode === 'new'
                    ? 'circle(0% at 50% 50%)'
                    : moon.illumination >= 50
                    ? `inset(0 0 0 ${100 - moon.illumination}%)`
                    : `inset(0 ${100 - moon.illumination * 2}% 0 0)`,
              }}
            />
            {/* Subtle lunar glow border */}
            <div className="absolute inset-0 rounded-full border border-indigo-400/20 pointer-events-none" />
          </div>

          <div className="space-y-1">
            <div className="text-base font-bold text-neutral-100 font-display">
              {moon.phaseName}
            </div>
            <div className="text-xs text-neutral-400">
              {moon.illumination >= 95
                ? 'Full lunar brilliance illuminate night sky'
                : moon.illumination <= 5
                ? 'Ideal night for stargazing and astronomical observation'
                : `Lunar disc is ${moon.phaseName.toLowerCase().includes('waxing') ? 'waxing towards full' : 'waning towards new'}`}
            </div>
          </div>
        </div>

        {/* Lunar cycle details */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-xs text-neutral-400">
          <span>Lunar Age: <strong className="text-neutral-200">{moon.moonAgeDays}d</strong></span>
          <span>Visibility: <strong className="text-neutral-200">{moon.illumination}%</strong></span>
          <span>Next Major: <strong className="text-indigo-300">
            {moon.moonAgeDays < 14.8 ? 'Full Moon' : 'New Moon'}
          </strong></span>
        </div>
      </div>
    </div>
  );
}
