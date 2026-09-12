export type UnitSystem = 'metric' | 'imperial';

export interface LocationInfo {
  name: string;
  region?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  isDetectedGeo?: boolean;
}

export interface CurrentWeatherMetrics {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  dewPoint: number;
  visibility: number; // in meters
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  surfacePressure: number;
  pressureTendency: 'rising' | 'falling' | 'steady';
  cloudCover: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  snowfall: number;
}

export interface AirQualityMetrics {
  usAqi: number;
  europeanAqi: number;
  pm2_5: number;
  pm10: number;
  no2: number;
  o3: number;
  label: string;
  color: string;
  advice: string;
}

export interface SolarEphemeris {
  sunrise: string;
  sunset: string;
  daylightDuration: number; // seconds
  daylightDurationFormatted: string;
  solarProgressPercent: number; // 0 - 100
}

export interface MoonEphemeris {
  phaseName: string;
  phaseCode: string;
  illumination: number; // 0 - 100
  moonAgeDays: number;
}

export interface HourlyForecastItem {
  time: string;
  displayHour: string;
  temperature: number;
  apparentTemperature: number;
  dewPoint: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  displayDay: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  daylightDuration: number;
  uvIndexMax: number;
  precipitationProbabilityMax: number;
  precipitationSum: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
}

export interface WeatherData {
  location: LocationInfo;
  timezone: string;
  timezoneAbbreviation?: string;
  elevation: number;
  current: CurrentWeatherMetrics;
  airQuality?: AirQualityMetrics;
  solar: SolarEphemeris;
  moon: MoonEphemeris;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  updatedAt: string;
  syncedTimestamp: number;
}

export type WeatherCategory = 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog';

export interface WeatherConditionInterpretation {
  code: number;
  label: string;
  description: string;
  category: WeatherCategory;
  iconName: string;
  themeGradient: string;
  accentBorder: string;
  badgeBg: string;
}

export interface GeocodeResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string;
  timezone?: string;
}

