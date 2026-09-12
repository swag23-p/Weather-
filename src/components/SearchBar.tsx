import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { LocationInfo } from '../types';
import { searchLocations, POPULAR_LOCATIONS } from '../services/weatherService';

interface SearchBarProps {
  onSelectLocation: (loc: LocationInfo) => void;
  currentLocation: LocationInfo | null;
}

export function SearchBar({ onSelectLocation, currentLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchLocations(query);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error('Location search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc: LocationInfo) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="w-full space-y-3" ref={containerRef}>
      {/* Search Input Container */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>
          <input
            id="weather-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search city, region, or coordinates (e.g., Tokyo, Zurich, Vancouver)..."
            className="w-full pl-10 pr-10 py-2.5 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-100 placeholder-neutral-500 rounded-xl border border-neutral-700/70 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/40 text-sm transition-all"
          />
          {query && (
            <button
              id="clear-search-btn"
              type="button"
              onClick={handleClear}
              aria-label="Clear search input"
              className="absolute right-3 p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {isOpen && results.length > 0 && (
          <div className="absolute z-40 w-full mt-2 bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/80 rounded-xl shadow-xl overflow-hidden divide-y divide-neutral-800">
            {results.map((item, idx) => (
              <button
                key={`${item.latitude}-${item.longitude}-${idx}`}
                id={`search-result-${idx}`}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-neutral-800/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-neutral-400 group-hover:text-sky-400 transition-colors shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-neutral-100 group-hover:text-sky-300 transition-colors">
                      {item.name}
                    </span>
                    {(item.region || item.country) && (
                      <span className="text-xs text-neutral-400 ml-2">
                        {[item.region, item.country].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-neutral-500 font-mono">
                  {item.latitude.toFixed(1)}°, {item.longitude.toFixed(1)}°
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Location Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-neutral-500 uppercase tracking-wider text-[11px] font-semibold mr-1 shrink-0">
          Quick:
        </span>
        {POPULAR_LOCATIONS.map((loc) => {
          const isSelected =
            currentLocation &&
            Math.abs(currentLocation.latitude - loc.latitude) < 0.05 &&
            Math.abs(currentLocation.longitude - loc.longitude) < 0.05;

          return (
            <button
              key={loc.name}
              id={`quick-loc-${loc.name.toLowerCase()}`}
              type="button"
              onClick={() => onSelectLocation(loc)}
              className={`px-3 py-1 rounded-full whitespace-nowrap border transition-all text-xs font-medium shrink-0 ${
                isSelected
                  ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 font-semibold'
                  : 'bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 border-neutral-700/60 hover:border-neutral-600'
              }`}
            >
              {loc.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
