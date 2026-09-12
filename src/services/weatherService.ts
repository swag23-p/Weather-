import { WeatherData, LocationInfo, GeocodeResult, AirQualityMetrics } from '../types';
import { calculateMoonPhase, formatDaylight, interpretAqi } from './weatherInterpreter';

export const POPULAR_LOCATIONS: LocationInfo[] = [
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, elevation: 40 },
  { name: 'London', region: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, elevation: 25 },
  { name: 'New York', region: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060, elevation: 10 },
  { name: 'Zurich', region: 'Zurich', country: 'Switzerland', latitude: 47.3769, longitude: 8.5417, elevation: 408 },
  { name: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, elevation: 15 },
  { name: 'San Francisco', region: 'California', country: 'United States', latitude: 37.7749, longitude: -122.4194, elevation: 16 },
  { name: 'Sydney', region: 'New South Wales', country: 'Australia', latitude: -33.8688, longitude: 151.2093, elevation: 20 },
];

/**
 * Reverse geocodes coordinates to a recognizable location name
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationInfo> {
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetch(bdcUrl, { headers: { Accept: 'application/json' } });
    if (response.ok) {
      const data = await response.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Detected Location';
      return {
        name: city,
        region: data.principalSubdivision || '',
        country: data.countryName || '',
        countryCode: data.countryCode || '',
        latitude,
        longitude,
        isDetectedGeo: true,
      };
    }
  } catch (err) {
    console.warn('Primary reverse geocoding unavailable, trying fallback', err);
  }

  // Fallback: OpenStreetMap Nominatim reverse
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`;
    const response = await fetch(osmUrl, {
      headers: { 'User-Agent': 'WeatherDetectorEnterprise/1.0', Accept: 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.county || addr.state || 'Local Station';
      return {
        name: cityName,
        region: addr.state || '',
        country: addr.country || '',
        latitude,
        longitude,
        isDetectedGeo: true,
      };
    }
  } catch (err) {
    console.warn('Secondary reverse geocode failed', err);
  }

  // Final fallback with formatted coordinates
  const latStr = `${Math.abs(latitude).toFixed(2)}°${latitude >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(longitude).toFixed(2)}°${longitude >= 0 ? 'E' : 'W'}`;
  return {
    name: `${latStr}, ${lonStr}`,
    region: 'Meteorological Station',
    country: 'GPS Fix',
    latitude,
    longitude,
    isDetectedGeo: true,
  };
}

/**
 * Search locations using Open-Meteo Geocoding API
 */
export async function searchLocations(query: string): Promise<LocationInfo[]> {
  if (!query || query.trim().length < 2) return [];

  const trimmed = query.trim();
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=6&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item: GeocodeResult) => ({
      name: item.name,
      region: item.admin1 || '',
      country: item.country || '',
      countryCode: item.country_code || '',
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      isDetectedGeo: false,
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

/**
 * Fetch Air Quality metrics from Open-Meteo Air Quality API
 */
async function fetchAirQuality(latitude: number, longitude: number): Promise<AirQualityMetrics | undefined> {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const data = await res.json();
    const curr = data.current;
    if (!curr) return undefined;

    const usAqi = Math.round(curr.us_aqi ?? 35);
    const interp = interpretAqi(usAqi);

    return {
      usAqi,
      europeanAqi: Math.round(curr.european_aqi ?? 20),
      pm2_5: Math.round((curr.pm2_5 ?? 10) * 10) / 10,
      pm10: Math.round((curr.pm10 ?? 18) * 10) / 10,
      no2: Math.round((curr.nitrogen_dioxide ?? 12) * 10) / 10,
      o3: Math.round((curr.ozone ?? 30) * 10) / 10,
      label: interp.label,
      color: interp.color,
      advice: interp.advice,
    };
  } catch (err) {
    console.warn('Air quality fetch error:', err);
    return undefined;
  }
}

/**
 * Fetch real-time weather, hourly, and daily metrics from Open-Meteo API
 */
export async function fetchWeatherData(location: LocationInfo): Promise<WeatherData> {
  const { latitude, longitude } = location;

  const currentVars = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ].join(',');

  const hourlyVars = [
    'temperature_2m',
    'relative_humidity_2m',
    'dew_point_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'pressure_msl',
    'surface_pressure',
    'visibility',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
    'uv_index',
    'is_day',
  ].join(',');

  const dailyVars = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'daylight_duration',
    'uv_index_max',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_gusts_10m_max',
    'wind_direction_10m_dominant',
  ].join(',');

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=${currentVars}&hourly=${hourlyVars}&daily=${dailyVars}&timezone=auto&forecast_days=8`;

  // Fetch forecast and air quality concurrently
  const [weatherRes, airQuality] = await Promise.all([
    fetch(weatherUrl),
    fetchAirQuality(latitude, longitude),
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Open-Meteo API error: ${weatherRes.status} ${weatherRes.statusText}`);
  }

  const data = await weatherRes.json();
  const current = data.current;
  const hourlyRaw = data.hourly;
  const dailyRaw = data.daily;
  const elevation = data.elevation ?? location.elevation ?? 0;

  // Process next 24 hourly periods starting from current time
  const now = new Date();
  const hourlyTimes: string[] = hourlyRaw.time || [];
  
  // Find current index in hourly array
  let startIndex = hourlyTimes.findIndex((t: string) => new Date(t).getTime() >= now.getTime() - 3600 * 1000);
  if (startIndex === -1) startIndex = 0;

  const hourly = hourlyTimes.slice(startIndex, startIndex + 24).map((timeStr: string, idx: number) => {
    const originalIdx = startIndex + idx;
    const dateObj = new Date(timeStr);
    const displayHour = idx === 0 
      ? 'Now' 
      : dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    return {
      time: timeStr,
      displayHour,
      temperature: hourlyRaw.temperature_2m[originalIdx] ?? 0,
      apparentTemperature: hourlyRaw.apparent_temperature?.[originalIdx] ?? hourlyRaw.temperature_2m[originalIdx] ?? 0,
      dewPoint: hourlyRaw.dew_point_2m?.[originalIdx] ?? 10,
      humidity: hourlyRaw.relative_humidity_2m[originalIdx] ?? 0,
      precipitationProbability: hourlyRaw.precipitation_probability[originalIdx] ?? 0,
      precipitation: hourlyRaw.precipitation?.[originalIdx] ?? 0,
      weatherCode: hourlyRaw.weather_code[originalIdx] ?? 0,
      windSpeed: hourlyRaw.wind_speed_10m[originalIdx] ?? 0,
      windDirection: hourlyRaw.wind_direction_10m?.[originalIdx] ?? 0,
      windGusts: hourlyRaw.wind_gusts_10m?.[originalIdx] ?? hourlyRaw.wind_speed_10m[originalIdx] ?? 0,
      uvIndex: hourlyRaw.uv_index[originalIdx] ?? 0,
      visibility: hourlyRaw.visibility?.[originalIdx] ?? 10000,
      pressure: hourlyRaw.pressure_msl?.[originalIdx] ?? 1013,
      isDay: Boolean(hourlyRaw.is_day[originalIdx] ?? 1),
    };
  });

  // Calculate pressure tendency over past 3 hours
  let pressureTendency: 'rising' | 'falling' | 'steady' = 'steady';
  if (startIndex >= 3 && hourlyRaw.pressure_msl) {
    const pastPressure = hourlyRaw.pressure_msl[startIndex - 3];
    const currentPressure = current.pressure_msl;
    if (pastPressure) {
      const diff = currentPressure - pastPressure;
      if (diff > 1.0) pressureTendency = 'rising';
      else if (diff < -1.0) pressureTendency = 'falling';
    }
  }

  // Calculate current dew point and visibility from closest hourly
  const currentDewPoint = hourlyRaw.dew_point_2m?.[startIndex] ?? (current.temperature_2m - ((100 - current.relative_humidity_2m) / 5));
  const currentVisibility = hourlyRaw.visibility?.[startIndex] ?? 10000;

  // Process 7 daily forecasts
  const dailyTimes: string[] = dailyRaw.time || [];
  const daily = dailyTimes.slice(0, 7).map((dateStr: string, idx: number) => {
    const dateObj = new Date(dateStr + 'T12:00:00');
    let displayDay = dateObj.toLocaleDateString([], { weekday: 'short' });
    if (idx === 0) displayDay = 'Today';
    if (idx === 1) displayDay = 'Tomorrow';

    return {
      date: dateStr,
      displayDay,
      weatherCode: dailyRaw.weather_code[idx] ?? 0,
      tempMax: dailyRaw.temperature_2m_max[idx] ?? 0,
      tempMin: dailyRaw.temperature_2m_min[idx] ?? 0,
      apparentTempMax: dailyRaw.apparent_temperature_max?.[idx] ?? dailyRaw.temperature_2m_max[idx] ?? 0,
      apparentTempMin: dailyRaw.apparent_temperature_min?.[idx] ?? dailyRaw.temperature_2m_min[idx] ?? 0,
      sunrise: dailyRaw.sunrise[idx] ?? '',
      sunset: dailyRaw.sunset[idx] ?? '',
      daylightDuration: dailyRaw.daylight_duration?.[idx] ?? 43200,
      uvIndexMax: dailyRaw.uv_index_max[idx] ?? 0,
      precipitationProbabilityMax: dailyRaw.precipitation_probability_max[idx] ?? 0,
      precipitationSum: dailyRaw.precipitation_sum[idx] ?? 0,
      windSpeedMax: dailyRaw.wind_speed_10m_max[idx] ?? 0,
      windGustsMax: dailyRaw.wind_gusts_10m_max?.[idx] ?? dailyRaw.wind_speed_10m_max[idx] ?? 0,
      windDirectionDominant: dailyRaw.wind_direction_10m_dominant?.[idx] ?? 0,
    };
  });

  // Calculate Solar Ephemeris Progress
  const todayDaily = daily[0];
  let solarProgressPercent = 50;
  if (todayDaily?.sunrise && todayDaily?.sunset) {
    const sunriseTime = new Date(todayDaily.sunrise).getTime();
    const sunsetTime = new Date(todayDaily.sunset).getTime();
    const currentTime = now.getTime();
    if (currentTime <= sunriseTime) {
      solarProgressPercent = 0;
    } else if (currentTime >= sunsetTime) {
      solarProgressPercent = 100;
    } else {
      solarProgressPercent = Math.round(((currentTime - sunriseTime) / (sunsetTime - sunriseTime)) * 100);
    }
  }

  const solar = {
    sunrise: todayDaily?.sunrise ?? '',
    sunset: todayDaily?.sunset ?? '',
    daylightDuration: todayDaily?.daylightDuration ?? 43200,
    daylightDurationFormatted: formatDaylight(todayDaily?.daylightDuration ?? 43200),
    solarProgressPercent,
  };

  const moon = calculateMoonPhase(now);

  const enrichedLocation: LocationInfo = {
    ...location,
    elevation,
  };

  return {
    location: enrichedLocation,
    timezone: data.timezone || 'UTC',
    timezoneAbbreviation: data.timezone_abbreviation || '',
    elevation,
    current: {
      time: current.time,
      temperature: current.temperature_2m ?? 0,
      apparentTemperature: current.apparent_temperature ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      dewPoint: Math.round(currentDewPoint * 10) / 10,
      visibility: currentVisibility,
      windSpeed: current.wind_speed_10m ?? 0,
      windDirection: current.wind_direction_10m ?? 0,
      windGusts: current.wind_gusts_10m ?? current.wind_speed_10m ?? 0,
      pressure: current.pressure_msl ?? 1013,
      surfacePressure: current.surface_pressure ?? current.pressure_msl ?? 1013,
      pressureTendency,
      cloudCover: current.cloud_cover ?? 0,
      weatherCode: current.weather_code ?? 0,
      isDay: Boolean(current.is_day ?? 1),
      precipitation: current.precipitation ?? 0,
      rain: current.rain ?? 0,
      snowfall: current.snowfall ?? 0,
    },
    airQuality,
    solar,
    moon,
    hourly,
    daily,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    syncedTimestamp: Date.now(),
  };
}

