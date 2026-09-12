import { WeatherConditionInterpretation, WeatherCategory } from '../types';

export function interpretWeatherCode(code: number, isDay: boolean = true): WeatherConditionInterpretation {
  switch (code) {
    case 0:
      return {
        code,
        label: isDay ? 'Clear Sky' : 'Clear Night',
        description: isDay ? 'Sunny skies with unobstructed sunlight.' : 'Starry night with clear atmospheric visibility.',
        category: 'clear',
        iconName: isDay ? 'Sun' : 'Moon',
        themeGradient: isDay 
          ? 'from-amber-500/20 via-orange-500/10 to-transparent' 
          : 'from-indigo-950/40 via-slate-900/30 to-transparent',
        accentBorder: isDay ? 'border-amber-500/30' : 'border-indigo-500/30',
        badgeBg: isDay ? 'bg-amber-500/10 text-amber-300' : 'bg-indigo-500/10 text-indigo-300',
      };
    case 1:
      return {
        code,
        label: isDay ? 'Mainly Sunny' : 'Mainly Clear',
        description: 'Scattered fair-weather clouds with abundant clarity.',
        category: 'partly-cloudy',
        iconName: isDay ? 'SunMedium' : 'CloudMoon',
        themeGradient: isDay
          ? 'from-sky-500/20 via-amber-500/10 to-transparent'
          : 'from-slate-800/40 via-slate-900/30 to-transparent',
        accentBorder: isDay ? 'border-sky-500/30' : 'border-slate-600/30',
        badgeBg: isDay ? 'bg-sky-500/10 text-sky-300' : 'bg-slate-700/30 text-slate-300',
      };
    case 2:
      return {
        code,
        label: 'Partly Cloudy',
        description: 'Alternating sunlight and passing cloud formations.',
        category: 'partly-cloudy',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        themeGradient: 'from-sky-600/20 via-slate-800/20 to-transparent',
        accentBorder: 'border-sky-500/30',
        badgeBg: 'bg-sky-500/10 text-sky-300',
      };
    case 3:
      return {
        code,
        label: 'Overcast',
        description: 'Uniform dense cloud ceiling obscuring the sun.',
        category: 'cloudy',
        iconName: 'Cloud',
        themeGradient: 'from-slate-700/30 via-slate-800/20 to-transparent',
        accentBorder: 'border-slate-600/30',
        badgeBg: 'bg-slate-700/30 text-slate-300',
      };
    case 45:
    case 48:
      return {
        code,
        label: code === 45 ? 'Foggy' : 'Depositing Rime Fog',
        description: 'Reduced horizontal visibility with dense ground mist.',
        category: 'fog',
        iconName: 'CloudFog',
        themeGradient: 'from-zinc-600/25 via-slate-800/20 to-transparent',
        accentBorder: 'border-zinc-500/30',
        badgeBg: 'bg-zinc-600/20 text-zinc-300',
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: code === 51 ? 'Light Drizzle' : code === 53 ? 'Moderate Drizzle' : 'Dense Drizzle',
        description: 'Fine atmospheric mist with steady microscopic droplets.',
        category: 'rain',
        iconName: 'CloudDrizzle',
        themeGradient: 'from-cyan-700/25 via-slate-800/20 to-transparent',
        accentBorder: 'border-cyan-500/30',
        badgeBg: 'bg-cyan-500/10 text-cyan-300',
      };
    case 56:
    case 57:
      return {
        code,
        label: 'Freezing Drizzle',
        description: 'Sub-zero liquid droplets freezing upon surface contact.',
        category: 'snow',
        iconName: 'CloudSnow',
        themeGradient: 'from-teal-800/30 via-slate-900/30 to-transparent',
        accentBorder: 'border-teal-400/30',
        badgeBg: 'bg-teal-500/10 text-teal-300',
      };
    case 61:
      return {
        code,
        label: 'Light Rain',
        description: 'Gentle steady rainfall, roads damp with minimal pooling.',
        category: 'rain',
        iconName: 'CloudRain',
        themeGradient: 'from-blue-700/25 via-slate-800/20 to-transparent',
        accentBorder: 'border-blue-500/30',
        badgeBg: 'bg-blue-500/10 text-blue-300',
      };
    case 63:
      return {
        code,
        label: 'Moderate Rain',
        description: 'Consistent active rain showers across the region.',
        category: 'rain',
        iconName: 'CloudRain',
        themeGradient: 'from-blue-800/30 via-slate-900/30 to-transparent',
        accentBorder: 'border-blue-500/30',
        badgeBg: 'bg-blue-500/15 text-blue-300',
      };
    case 65:
      return {
        code,
        label: 'Heavy Downpour',
        description: 'Intense precipitation with potential surface runoff.',
        category: 'rain',
        iconName: 'CloudRain',
        themeGradient: 'from-blue-900/40 via-slate-900/40 to-transparent',
        accentBorder: 'border-blue-400/40',
        badgeBg: 'bg-blue-500/20 text-blue-200',
      };
    case 66:
    case 67:
      return {
        code,
        label: 'Freezing Rain',
        description: 'Hazardous icy glaze developing on outdoor surfaces.',
        category: 'snow',
        iconName: 'CloudSnow',
        themeGradient: 'from-indigo-900/35 via-slate-900/30 to-transparent',
        accentBorder: 'border-indigo-400/30',
        badgeBg: 'bg-indigo-500/15 text-indigo-200',
      };
    case 71:
    case 73:
    case 75:
      return {
        code,
        label: code === 71 ? 'Light Snowfall' : code === 73 ? 'Moderate Snow' : 'Heavy Snowstorm',
        description: 'Crystalline frozen precipitation creating cold accumulations.',
        category: 'snow',
        iconName: 'Snowflake',
        themeGradient: 'from-sky-800/30 via-slate-900/30 to-transparent',
        accentBorder: 'border-sky-300/30',
        badgeBg: 'bg-sky-400/15 text-sky-200',
      };
    case 77:
      return {
        code,
        label: 'Snow Grains',
        description: 'Minute opaque ice grains bouncing gently off grounds.',
        category: 'snow',
        iconName: 'Snowflake',
        themeGradient: 'from-slate-700/30 via-slate-900/30 to-transparent',
        accentBorder: 'border-slate-400/30',
        badgeBg: 'bg-slate-600/20 text-slate-200',
      };
    case 80:
    case 81:
    case 82:
      return {
        code,
        label: code === 82 ? 'Violent Rain Showers' : 'Passing Rain Showers',
        description: 'Bursts of rain interspersed with fluctuating cloud cover.',
        category: 'rain',
        iconName: 'CloudRain',
        themeGradient: 'from-blue-800/30 via-slate-900/30 to-transparent',
        accentBorder: 'border-blue-400/30',
        badgeBg: 'bg-blue-500/15 text-blue-300',
      };
    case 85:
    case 86:
      return {
        code,
        label: 'Snow Showers',
        description: 'Intermittent bursts of snow flurries and chilled gusts.',
        category: 'snow',
        iconName: 'Snowflake',
        themeGradient: 'from-sky-900/30 via-slate-900/30 to-transparent',
        accentBorder: 'border-sky-400/30',
        badgeBg: 'bg-sky-500/15 text-sky-200',
      };
    case 95:
      return {
        code,
        label: 'Thunderstorm',
        description: 'Atmospheric electrical discharge with rumbling and rain.',
        category: 'thunder',
        iconName: 'CloudLightning',
        themeGradient: 'from-amber-600/25 via-purple-950/40 to-slate-950/50',
        accentBorder: 'border-amber-500/40',
        badgeBg: 'bg-amber-500/15 text-amber-300',
      };
    case 96:
    case 99:
      return {
        code,
        label: 'Severe Thunderstorm with Hail',
        description: 'Violent convective squalls with lightning and hail impacts.',
        category: 'thunder',
        iconName: 'Zap',
        themeGradient: 'from-red-950/30 via-purple-950/40 to-slate-950/60',
        accentBorder: 'border-red-500/40',
        badgeBg: 'bg-red-500/15 text-red-300',
      };
    default:
      return {
        code,
        label: 'Variable Conditions',
        description: 'Typical atmospheric conditions for the current season.',
        category: 'cloudy',
        iconName: 'Cloud',
        themeGradient: 'from-slate-800/30 via-slate-900/30 to-transparent',
        accentBorder: 'border-slate-700/30',
        badgeBg: 'bg-slate-700/20 text-slate-300',
      };
  }
}

export function getWindCompass(degrees: number): { text: string; full: string } {
  const directions = [
    { text: 'N', full: 'North' },
    { text: 'NNE', full: 'North-Northeast' },
    { text: 'NE', full: 'Northeast' },
    { text: 'ENE', full: 'East-Northeast' },
    { text: 'E', full: 'East' },
    { text: 'ESE', full: 'East-Southeast' },
    { text: 'SE', full: 'Southeast' },
    { text: 'SSE', full: 'South-Southeast' },
    { text: 'S', full: 'South' },
    { text: 'SSW', full: 'South-Southwest' },
    { text: 'SW', full: 'Southwest' },
    { text: 'WSW', full: 'West-Southwest' },
    { text: 'W', full: 'West' },
    { text: 'WNW', full: 'West-Northwest' },
    { text: 'NW', full: 'Northwest' },
    { text: 'NNW', full: 'North-Northwest' },
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getUvCategory(uvIndex: number): { label: string; color: string; advice: string } {
  if (uvIndex < 3) {
    return { label: 'Low', color: 'text-emerald-400', advice: 'No special protection required. Safe for outdoor activities.' };
  } else if (uvIndex < 6) {
    return { label: 'Moderate', color: 'text-amber-400', advice: 'Wear sunglasses, apply SPF 30+ sunscreen, seek shade during midday.' };
  } else if (uvIndex < 8) {
    return { label: 'High', color: 'text-orange-400', advice: 'Protection required: hat, UV-blocking sunglasses, and frequent sunscreen.' };
  } else if (uvIndex < 11) {
    return { label: 'Very High', color: 'text-rose-400', advice: 'Extra protection: avoid direct sun between 11 AM and 3 PM.' };
  } else {
    return { label: 'Extreme', color: 'text-purple-400', advice: 'Extreme risk. Stay in shade or indoors during peak sunlight hours.' };
  }
}

export function getHumidityDescription(humidity: number): string {
  if (humidity < 30) return 'Very dry atmospheric air';
  if (humidity <= 55) return 'Comfortable, optimal respiration';
  if (humidity <= 75) return 'Moderately humid';
  return 'Muggy and moisture-saturated';
}

export function formatTemp(tempCelsius: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    const fahrenheit = (tempCelsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°`;
  }
  return `${Math.round(tempCelsius)}°`;
}

export function formatSpeed(speedKmh: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    const mph = speedKmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
}

export function formatPrecipitation(precipMm: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    const inches = precipMm * 0.0393701;
    return `${inches.toFixed(2)} in`;
  }
  return `${precipMm.toFixed(1)} mm`;
}

export function formatPressure(pressureHpa: number, unit: 'metric' | 'imperial'): string {
  if (unit === 'imperial') {
    const inHg = pressureHpa * 0.02953;
    return `${inHg.toFixed(2)} inHg`;
  }
  return `${Math.round(pressureHpa)} hPa`;
}

export function formatVisibility(visibilityMeters: number, unit: 'metric' | 'imperial'): { value: string; label: string } {
  if (unit === 'imperial') {
    const miles = visibilityMeters / 1609.344;
    const value = miles >= 10 ? `${Math.round(miles)} mi` : `${miles.toFixed(1)} mi`;
    const label = miles >= 10 ? 'Unrestricted (VFR)' : miles >= 5 ? 'Good' : miles >= 3 ? 'Moderate' : 'Restricted (IFR)';
    return { value, label };
  }
  const km = visibilityMeters / 1000;
  const value = km >= 10 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`;
  const label = km >= 10 ? 'Unrestricted (VFR)' : km >= 6 ? 'Good' : km >= 3 ? 'Moderate' : 'Restricted (IFR)';
  return { value, label };
}

export function getDewPointDescription(dewPointCelsius: number): { label: string; comfort: string } {
  if (dewPointCelsius < 10) return { label: 'Dry & Crisp', comfort: 'Very comfortable skin evaporation' };
  if (dewPointCelsius <= 15) return { label: 'Comfortable', comfort: 'Pleasant atmospheric balance' };
  if (dewPointCelsius <= 18) return { label: 'Noticeable', comfort: 'Moderate atmospheric moisture' };
  if (dewPointCelsius <= 21) return { label: 'Humid & Sticky', comfort: 'Sweat evaporates slower' };
  return { label: 'Oppressive', comfort: 'High heat stress potential' };
}

export function getBeaufortScale(speedKmh: number): { force: number; name: string; description: string } {
  if (speedKmh < 1) return { force: 0, name: 'Calm', description: 'Smoke rises vertically; wind still.' };
  if (speedKmh <= 5) return { force: 1, name: 'Light Air', description: 'Direction shown by smoke drift only.' };
  if (speedKmh <= 11) return { force: 2, name: 'Light Breeze', description: 'Wind felt on face; leaves rustle.' };
  if (speedKmh <= 19) return { force: 3, name: 'Gentle Breeze', description: 'Leaves & small twigs in constant motion.' };
  if (speedKmh <= 28) return { force: 4, name: 'Moderate Breeze', description: 'Dust and loose paper raised; small branches move.' };
  if (speedKmh <= 38) return { force: 5, name: 'Fresh Breeze', description: 'Small trees in leaf begin to sway.' };
  if (speedKmh <= 49) return { force: 6, name: 'Strong Breeze', description: 'Large branches in motion; whistling in wires.' };
  if (speedKmh <= 61) return { force: 7, name: 'Near Gale', description: 'Whole trees in motion; walking against wind impeded.' };
  if (speedKmh <= 74) return { force: 8, name: 'Gale', description: 'Twigs break off trees; progress generally impeded.' };
  if (speedKmh <= 88) return { force: 9, name: 'Strong Gale', description: 'Slight structural damage occurs.' };
  return { force: 10, name: 'Storm', description: 'Seldom experienced inland; trees uprooted.' };
}

export function interpretAqi(usAqi: number): { label: string; color: string; advice: string } {
  if (usAqi <= 50) {
    return {
      label: 'Good (0-50)',
      color: 'text-emerald-400',
      advice: 'Air quality is satisfactory and poses little or no risk.',
    };
  } else if (usAqi <= 100) {
    return {
      label: 'Moderate (51-100)',
      color: 'text-amber-400',
      advice: 'Acceptable quality; unusually sensitive people should limit prolonged outdoor exertion.',
    };
  } else if (usAqi <= 150) {
    return {
      label: 'Sensitive Groups (101-150)',
      color: 'text-orange-400',
      advice: 'Members of sensitive groups may experience health effects. General public less likely affected.',
    };
  } else if (usAqi <= 200) {
    return {
      label: 'Unhealthy (151-200)',
      color: 'text-rose-400',
      advice: 'Everyone may begin to experience health effects; sensitive groups should avoid outdoor exertion.',
    };
  } else {
    return {
      label: 'Very Unhealthy (200+)',
      color: 'text-purple-400',
      advice: 'Health alert: serious risk for the entire population. Remain indoors with air filtration.',
    };
  }
}

/**
 * Calculates current Moon Phase and illumination percentage based on date
 */
export function calculateMoonPhase(date: Date = new Date()): {
  phaseName: string;
  phaseCode: string;
  illumination: number;
  moonAgeDays: number;
} {
  // Known reference new moon: January 11, 2024, 11:57 UTC
  const synodicMonth = 29.53058867;
  const refDate = new Date('2024-01-11T11:57:00Z').getTime();
  const diffTime = date.getTime() - refDate;
  const daysSinceRef = diffTime / (1000 * 60 * 60 * 24);
  const cycle = ((daysSinceRef % synodicMonth) + synodicMonth) % synodicMonth;
  const moonAge = cycle;

  // Illumination calculation (0 to 100%)
  const illumination = Math.round(((1 - Math.cos((2 * Math.PI * cycle) / synodicMonth)) / 2) * 100);

  let phaseName = 'New Moon';
  let phaseCode = 'new';

  if (moonAge < 1.845) {
    phaseName = 'New Moon';
    phaseCode = 'new';
  } else if (moonAge < 5.536) {
    phaseName = 'Waxing Crescent';
    phaseCode = 'waxing_crescent';
  } else if (moonAge < 9.228) {
    phaseName = 'First Quarter';
    phaseCode = 'first_quarter';
  } else if (moonAge < 12.919) {
    phaseName = 'Waxing Gibbous';
    phaseCode = 'waxing_gibbous';
  } else if (moonAge < 16.61) {
    phaseName = 'Full Moon';
    phaseCode = 'full';
  } else if (moonAge < 20.302) {
    phaseName = 'Waning Gibbous';
    phaseCode = 'waning_gibbous';
  } else if (moonAge < 23.993) {
    phaseName = 'Last Quarter';
    phaseCode = 'last_quarter';
  } else if (moonAge < 27.684) {
    phaseName = 'Waning Crescent';
    phaseCode = 'waning_crescent';
  } else {
    phaseName = 'New Moon';
    phaseCode = 'new';
  }

  return {
    phaseName,
    phaseCode,
    illumination,
    moonAgeDays: Math.round(moonAge * 10) / 10,
  };
}

export function formatDaylight(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

