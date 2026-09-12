import { ShieldCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { WeatherData } from '../types';

interface DetectionInsightsProps {
  data: WeatherData;
}

export function DetectionInsights({ data }: DetectionInsightsProps) {
  const { current, hourly, daily } = data;
  const today = daily[0];

  // Derive detection insights based on actual atmospheric data
  const insights: {
    type: 'warning' | 'info' | 'positive';
    title: string;
    description: string;
  }[] = [];

  // 1. Rain alert
  const rainHours = hourly.slice(0, 12).filter((h) => h.precipitationProbability >= 40);
  if (rainHours.length > 0) {
    const peakHour = rainHours.reduce((max, h) => (h.precipitationProbability > max.precipitationProbability ? h : max), rainHours[0]);
    insights.push({
      type: 'warning',
      title: 'Precipitation Probable',
      description: `Rain likelihood reaches ${peakHour.precipitationProbability}% around ${peakHour.displayHour}. Carry an umbrella or rain shell.`,
    });
  } else {
    insights.push({
      type: 'positive',
      title: 'Dry Weather Window',
      description: 'Zero significant rainfall detected in the next 12 hours. Excellent conditions for outdoor commutes.',
    });
  }

  // 2. UV advisory
  if (today?.uvIndexMax && today.uvIndexMax >= 6) {
    insights.push({
      type: 'warning',
      title: `High Solar UV Index (${Math.round(today.uvIndexMax)})`,
      description: 'Sunburn risk within 20–30 minutes of unprotected midday exposure. Broad-spectrum sunscreen recommended.',
    });
  }

  // 3. Wind gusts
  if (current.windGusts >= 35) {
    insights.push({
      type: 'warning',
      title: 'Strong Gust Detection',
      description: `Sudden wind gusts measured at ${Math.round(current.windGusts)} km/h. Secure loose patio items and exercise caution when cycling.`,
    });
  }

  // 4. Comfort / Running / Outdoor Index
  if (current.temperature >= 15 && current.temperature <= 24 && current.humidity <= 65 && current.precipitation === 0) {
    insights.push({
      type: 'positive',
      title: 'Prime Outdoor Condition',
      description: 'Thermal comfort and atmospheric pressure are currently in the ideal human equilibrium range.',
    });
  } else if (current.temperature > 30) {
    insights.push({
      type: 'info',
      title: 'Thermal Heat Notice',
      description: 'Elevated ambient temperature. Ensure proper hydration and limit vigorous midday physical exertion.',
    });
  } else if (current.temperature < 5) {
    insights.push({
      type: 'info',
      title: 'Cold Atmosphere Notice',
      description: 'Sub-temperate readings. Multi-layer insulating clothing advised to retain core body heat.',
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider font-display">
            Meteorological Advisory & Detection Insights
          </h3>
        </div>
        <span className="text-xs text-neutral-500">Auto-Evaluated</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {insights.map((item, idx) => (
          <div
            key={idx}
            id={`insight-card-${idx}`}
            className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
              item.type === 'warning'
                ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                : item.type === 'positive'
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                : 'bg-neutral-900/80 border-neutral-800 text-neutral-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : item.type === 'positive' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Info className="w-4 h-4 text-sky-400" />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider">
                {item.title}
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
