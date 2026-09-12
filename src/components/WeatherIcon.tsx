import { 
  Sun, 
  SunMedium, 
  Moon, 
  Cloud, 
  CloudSun, 
  CloudMoon, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  Snowflake, 
  CloudLightning, 
  Zap 
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function WeatherIcon({ name, className = 'w-6 h-6', size }: WeatherIconProps) {
  const iconProps = { className, ...(size ? { size } : {}) };

  switch (name) {
    case 'Sun':
      return <Sun {...iconProps} className={`${className} text-amber-400`} />;
    case 'SunMedium':
      return <SunMedium {...iconProps} className={`${className} text-amber-300`} />;
    case 'Moon':
      return <Moon {...iconProps} className={`${className} text-indigo-300`} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} className={`${className} text-amber-300`} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} className={`${className} text-indigo-300`} />;
    case 'Cloud':
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} className={`${className} text-zinc-300`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} className={`${className} text-cyan-300`} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} className={`${className} text-blue-400`} />;
    case 'CloudSnow':
      return <CloudSnow {...iconProps} className={`${className} text-sky-200`} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} className={`${className} text-sky-200`} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} className={`${className} text-amber-400`} />;
    case 'Zap':
      return <Zap {...iconProps} className={`${className} text-amber-400`} />;
    default:
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
  }
}
