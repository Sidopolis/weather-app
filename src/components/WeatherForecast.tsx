import React from 'react';
import { motion } from 'framer-motion';
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiDust
} from 'react-icons/wi';

interface ForecastDay {
  day: string;
  temperature: number;
  condition: string;
}

interface WeatherForecastProps {
  forecast: ForecastDay[];
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <WiDaySunny className="text-yellow-400" />;
    case 'clouds':
      return <WiCloudy className="text-gray-400" />;
    case 'rain':
      return <WiRain className="text-blue-400" />;
    case 'snow':
      return <WiSnow className="text-blue-200" />;
    case 'thunderstorm':
      return <WiThunderstorm className="text-purple-400" />;
    default:
      return <WiDust size={32} />;
  }
};

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-4 w-full"
    >
      <h3 className="text-lg font-semibold mb-3 text-white/90">5-Day Forecast</h3>
      <div className="flex justify-between items-center space-x-2">
        {forecast.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex-1 bg-slate-800/30 rounded-lg p-2 text-center hover:bg-slate-700/30 transition-all"
          >
            <div className="text-sm font-medium text-white/80">{day.day}</div>
            <div className="text-3xl my-1">
              {getWeatherIcon(day.condition)}
            </div>
            <div className="text-lg font-bold text-white">{day.temperature}°C</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default WeatherForecast; 