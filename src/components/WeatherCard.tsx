import React from 'react';
import { motion } from 'framer-motion';
import { WiThermometer, WiHumidity, WiStrongWind, WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import '../styles/components.css';

interface WeatherCardProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  location: string;
}

const getWeatherTheme = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return {
        gradient: 'from-blue-400/30 to-amber-300/30',
        iconColor: 'text-yellow-400',
        accentColor: 'text-amber-400',
        secondaryGradient: 'from-amber-400/20 to-blue-400/20'
      };
    case 'clouds':
      return {
        gradient: 'from-slate-400/30 to-slate-600/30',
        iconColor: 'text-slate-300',
        accentColor: 'text-slate-300',
        secondaryGradient: 'from-slate-500/20 to-slate-400/20'
      };
    case 'rain':
      return {
        gradient: 'from-blue-600/30 to-blue-400/30',
        iconColor: 'text-blue-400',
        accentColor: 'text-blue-300',
        secondaryGradient: 'from-blue-500/20 to-blue-300/20'
      };
    case 'snow':
      return {
        gradient: 'from-blue-200/30 to-slate-300/30',
        iconColor: 'text-blue-200',
        accentColor: 'text-blue-100',
        secondaryGradient: 'from-blue-200/20 to-slate-200/20'
      };
    case 'thunderstorm':
      return {
        gradient: 'from-purple-600/30 to-blue-400/30',
        iconColor: 'text-purple-400',
        accentColor: 'text-purple-300',
        secondaryGradient: 'from-purple-500/20 to-blue-300/20'
      };
    default:
      return {
        gradient: 'from-blue-400/30 to-amber-300/30',
        iconColor: 'text-yellow-400',
        accentColor: 'text-amber-400',
        secondaryGradient: 'from-amber-400/20 to-blue-400/20'
      };
  }
};

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear': return <WiDaySunny className="text-yellow-400 text-5xl" />;
    case 'clouds': return <WiCloudy className="text-gray-400 text-5xl" />;
    case 'rain': return <WiRain className="text-blue-400 text-5xl" />;
    case 'snow': return <WiSnow className="text-blue-200 text-5xl" />;
    case 'thunderstorm': return <WiThunderstorm className="text-purple-400 text-5xl" />;
    default: return <WiDaySunny className="text-yellow-400 text-5xl" />;
  }
};

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  humidity,
  windSpeed,
  condition,
  location
}) => {
  const theme = getWeatherTheme(condition);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md rounded-xl p-4 shadow-lg"
    >
      <div className="flex items-center justify-between">
        {/* Left side - Location and Weather Icon */}
        <div className="flex items-center">
          <div className="mr-3">
            {getWeatherIcon(condition)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{location}</h2>
            <div className="text-sm text-blue-300">{condition}</div>
          </div>
        </div>

        {/* Right side - Temperature */}
        <div className="text-right">
          <div className="text-4xl font-bold text-white">{temperature}°C</div>
        </div>
      </div>

      {/* Weather Details */}
      <div className="flex justify-between mt-4 space-x-4">
        <motion.div 
          className="flex-1 flex items-center bg-white/5 rounded-lg p-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <WiHumidity className="text-3xl text-blue-400 mr-2" />
          <div>
            <div className="text-xs text-gray-400">Humidity</div>
            <div className="text-lg font-semibold text-white">{humidity}%</div>
          </div>
        </motion.div>

        <motion.div 
          className="flex-1 flex items-center bg-white/5 rounded-lg p-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <WiStrongWind className="text-3xl text-teal-400 mr-2" />
          <div>
            <div className="text-xs text-gray-400">Wind Speed</div>
            <div className="text-lg font-semibold text-white">{windSpeed} m/s</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;

interface WeatherStatProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const WeatherStat: React.FC<WeatherStatProps> = ({ icon, value, label }) => (
  <div className="weather-stat">
    <div className="weather-stat-icon">{icon}</div>
    <div className="weather-stat-value">{value}</div>
    <div className="weather-stat-label">{label}</div>
  </div>
); 