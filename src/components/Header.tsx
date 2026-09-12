import { useState, useEffect } from 'react';
import { LocateFixed, RefreshCw, Compass, AlertCircle, Clock, Globe } from 'lucide-react';
import { UnitSystem, LocationInfo } from '../types';

interface HeaderProps {
  currentLocation: LocationInfo | null;
  unit: UnitSystem;
  onToggleUnit: (unit: UnitSystem) => void;
  onDetectLocation: () => void;
  onRefresh: () => void;
  isDetectingGeo: boolean;
  isLoadingWeather: boolean;
  geoError: string | null;
}

export function Header({
  currentLocation,
  unit,
  onToggleUnit,
  onDetectLocation,
  onRefresh,
  isDetectingGeo,
  isLoadingWeather,
  geoError,
}: HeaderProps) {
  const [timeStr, setTimeStr] = useState('');
  const [utcStr, setUtcStr] = useState('');

  // Live real-time digital clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
      setUtcStr(now.toISOString().slice(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Observatory Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-sky-400 shadow-inner">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-neutral-100 font-display">
                Meteorological Detector
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
                PRO v2.4
              </span>
            </div>
            <div className="text-xs text-neutral-400 flex items-center gap-2">
              {currentLocation?.isDetectedGeo ? (
                <span className="inline-flex items-center text-emerald-400 gap-1.5 font-mono text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  GPS Receiver Active
                </span>
              ) : (
                <span className="font-mono text-[11px] text-neutral-400">
                  Global Ensemble Network
                </span>
              )}
              <span className="hidden sm:inline text-neutral-600">•</span>
              <span className="hidden sm:inline text-neutral-400 font-mono text-[11px]">ECMWF / GFS</span>
            </div>
          </div>
        </div>

        {/* Live Digital Station Clocks (Local & UTC) */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs font-mono text-neutral-300">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-neutral-400">LOCAL:</span>
            <span className="font-semibold text-neutral-100">{timeStr}</span>
          </div>
          <span className="text-neutral-700">|</span>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span>{utcStr}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Detect Location Button */}
          <button
            id="detect-weather-btn"
            type="button"
            onClick={onDetectLocation}
            disabled={isDetectingGeo || isLoadingWeather}
            title="Detect weather using your current device geolocation [Press G]"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 transition-all disabled:opacity-50 active:scale-95 shadow-xs"
          >
            <LocateFixed className={`w-3.5 h-3.5 text-sky-400 ${isDetectingGeo ? 'animate-spin' : ''}`} />
            <span>{isDetectingGeo ? 'Locating...' : 'Detect GPS'}</span>
            <kbd className="hidden sm:inline-block px-1 py-0.2 bg-neutral-800 border border-neutral-700 rounded text-[9px] text-neutral-400 font-mono ml-0.5">
              G
            </kbd>
          </button>

          {/* Unit Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-neutral-900 border border-neutral-700/80 text-xs font-medium">
            <button
              id="unit-celsius-btn"
              type="button"
              onClick={() => onToggleUnit('metric')}
              title="Metric Units (°C, km/h, mm, hPa)"
              className={`px-2.5 py-1 rounded-md transition-colors ${
                unit === 'metric'
                  ? 'bg-neutral-800 text-white font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              type="button"
              onClick={() => onToggleUnit('imperial')}
              title="Imperial Units (°F, mph, in, inHg)"
              className={`px-2.5 py-1 rounded-md transition-colors ${
                unit === 'imperial'
                  ? 'bg-neutral-800 text-white font-bold shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              °F
            </button>
          </div>

          {/* Manual Refresh Button */}
          <button
            id="refresh-weather-btn"
            type="button"
            onClick={onRefresh}
            disabled={isLoadingWeather}
            title="Refresh current station telemetry [Press R]"
            aria-label="Refresh weather data"
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/80 transition-all disabled:opacity-50 active:scale-95 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Geolocation Warning Banner if user denied or error */}
      {geoError && (
        <div className="bg-amber-950/40 border-t border-amber-800/40 px-4 py-2 text-xs text-amber-200 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{geoError} — displaying default observatory telemetry.</span>
          </div>
        </div>
      )}
    </header>
  );
}

