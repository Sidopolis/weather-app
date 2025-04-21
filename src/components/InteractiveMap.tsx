import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { WiDaySunny, WiRain, WiStrongWind } from 'react-icons/wi';
import '../styles/components.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { LocationSearch } from './LocationSearch';
import { IoSearch } from 'react-icons/io5';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

// Add severity levels for weather conditions
type SeverityLevel = 'low' | 'moderate' | 'high';

interface WeatherMarkerProps {
  coordinates: [number, number];
  weather: string;
  temperature: number;
  windSpeed: number;
}

const getWeatherSeverity = (temperature: number, windSpeed: number): SeverityLevel => {
  if (windSpeed > 63 || temperature > 40) return 'high';
  if (windSpeed > 50 || temperature > 35) return 'moderate';
  return 'low';
};

const WeatherMarker: React.FC<WeatherMarkerProps> = ({ coordinates, weather, temperature, windSpeed }) => {
  const severity = getWeatherSeverity(temperature, windSpeed);
  
  const severityColors = {
    low: '#4CAF50',      // Green
    moderate: '#FFC107', // Yellow
    high: '#F44336'      // Red
  };

  const getWeatherIcon = () => {
    switch (weather.toLowerCase()) {
      case 'rain':
        return <WiRain size={24} color={severityColors[severity]} />;
      case 'sunny':
        return <WiDaySunny size={24} color={severityColors[severity]} />;
      default:
        return <WiStrongWind size={24} color={severityColors[severity]} />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        duration: 0.5
      }}
    >
      <Marker position={coordinates}>
        <Popup>
          <div className="weather-marker" style={{ borderLeft: `4px solid ${severityColors[severity]}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {getWeatherIcon()}
              <span style={{ 
                color: severityColors[severity],
                fontWeight: 'bold'
              }}>
                {severity.toUpperCase()}
              </span>
            </div>
            <div style={{ marginTop: '8px' }}>
              <p>Temperature: {temperature}°C</p>
              <p>Wind Speed: {windSpeed} km/h</p>
              <p>Condition: {weather}</p>
              {severity === 'high' && (
                <p style={{ color: severityColors.high, fontWeight: 'bold' }}>
                  ⚠️ Warning: Severe weather conditions!
                </p>
              )}
            </div>
          </div>
        </Popup>
      </Marker>
    </motion.div>
  );
};

interface InteractiveMapProps {
  onLocationSelect: (coordinates: [number, number], zoomLevel?: number) => void;
  initialLocation?: [number, number] | null;
  weatherData?: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  } | null;
}

// Custom component to handle map clicks
const MapClickHandler: React.FC<{ onLocationSelect: (coordinates: [number, number], zoom: number) => void }> = ({ onLocationSelect }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    
    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onLocationSelect([lat, lng], map.getZoom());
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationSelect]);

  return null;
};

// Custom component to handle map updates
const MapUpdater: React.FC<{ center?: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 12, {
        animate: true,
        duration: 1
      });
    }
  }, [center, zoom, map]);

  return null;
};

// Custom marker icon for severe weather
const severeWeatherIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Add new types for enhanced disaster prediction
interface DisasterPrediction {
  type: string;
  severity: 'Low' | 'Moderate' | 'High';
  coordinates: [number, number] | null;
  description: string;
  probability: number;
  recommendations: string[];
  icon: string;
}

// Enhanced prediction system
const createDisasterPredictor = (initialLocation: [number, number] | null) => 
  (weatherData: any): DisasterPrediction[] => {
    const predictions: DisasterPrediction[] = [];
    
    if (weatherData) {
      const { temperature, humidity, windSpeed } = weatherData;
      
      // Cyclone prediction with probability
      if (windSpeed > 50) {
        const probability = ((windSpeed - 50) / 50) * 100;
        predictions.push({
          type: 'Cyclone',
          severity: windSpeed > 63 ? 'High' : 'Moderate',
          coordinates: initialLocation,
          description: `Hurricane-force winds detected. Wind speed: ${windSpeed}km/h`,
          probability: Math.min(probability, 100),
          recommendations: [
            'Stay indoors and away from windows',
            'Secure loose outdoor items',
            'Prepare emergency supplies',
            'Monitor local weather updates'
          ],
          icon: '🌪️'
        });
      }

      // Heat wave prediction
      if (temperature > 35) {
        const probability = ((temperature - 35) / 15) * 100;
        predictions.push({
          type: 'Heat Wave',
          severity: temperature > 40 ? 'High' : 'Moderate',
          coordinates: initialLocation,
          description: `High temperature alert: ${temperature}°C`,
          probability: Math.min(probability, 100),
          recommendations: [
            'Stay hydrated',
            'Avoid outdoor activities',
            'Find air-conditioned spaces',
            'Check on vulnerable neighbors'
          ],
          icon: '🌡️'
        });
      }

      // Flood risk with combined factors
      if (humidity > 70 && windSpeed > 20) {
        const probability = (humidity - 70) / 30 * 100;
        predictions.push({
          type: 'Flood Risk',
          severity: humidity > 85 ? 'High' : 'Moderate',
          coordinates: initialLocation,
          description: `High humidity (${humidity}%) with strong winds`,
          probability: Math.min(probability, 100),
          recommendations: [
            'Monitor water levels',
            'Prepare for possible evacuation',
            'Move valuables to higher ground',
            'Keep emergency contacts handy'
          ],
          icon: '🌊'
        });
      }

      // Thunderstorm prediction
      if (humidity > 80 && temperature > 25 && windSpeed > 15) {
        const probability = (humidity - 80) / 20 * 100;
        predictions.push({
          type: 'Thunderstorm',
          severity: windSpeed > 25 ? 'High' : 'Moderate',
          coordinates: initialLocation,
          description: 'Conditions favorable for thunderstorm development',
          probability: Math.min(probability, 100),
          recommendations: [
            'Seek indoor shelter',
            'Avoid open areas',
            'Unplug electronic devices',
            'Stay away from windows'
          ],
          icon: '⛈️'
        });
      }
    }

    return predictions;
  };

// Enhanced marker component for disasters
const DisasterMarker: React.FC<{ disaster: DisasterPrediction }> = ({ disaster }) => {
  const severityColors = {
    Low: '#4CAF50',
    Moderate: '#FFC107',
    High: '#F44336'
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: 1
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <Marker
        position={disaster.coordinates as [number, number]}
        icon={severeWeatherIcon}
      >
        <Popup>
          <div className="disaster-popup" style={{
            borderLeft: `4px solid ${severityColors[disaster.severity]}`,
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '24px' }}>{disaster.icon}</span>
              <h3 style={{ 
                color: severityColors[disaster.severity],
                margin: 0
              }}>
                {disaster.type}
              </h3>
            </div>
            
            <div className="disaster-details">
              <div className="probability-bar" style={{
                background: '#f0f0f0',
                borderRadius: '4px',
                height: '6px',
                marginBottom: '12px'
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${disaster.probability}%` }}
                  transition={{ duration: 1 }}
                  style={{
                    height: '100%',
                    background: severityColors[disaster.severity],
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <p style={{ margin: '8px 0' }}>
                <strong>Probability:</strong> {Math.round(disaster.probability)}%
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong>Severity:</strong> {disaster.severity}
              </p>
              <p style={{ margin: '8px 0' }}>{disaster.description}</p>
              
              <div style={{ marginTop: '16px' }}>
                <strong>Safety Recommendations:</strong>
                <ul style={{ 
                  margin: '8px 0',
                  paddingLeft: '20px'
                }}>
                  {disaster.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{ margin: '4px 0' }}
                    >
                      {rec}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    </motion.div>
  );
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  onLocationSelect, 
  initialLocation,
  weatherData 
}) => {
  const predictDisasters = createDisasterPredictor(initialLocation);
  const disasters = weatherData ? predictDisasters(weatherData) : [];

  return (
    <motion.div 
      className="map-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ position: 'relative' }}
    >
      <MapContainer
        center={initialLocation || [20.2961, 85.8245]}
        zoom={12}
        style={{ height: '400px', width: '100%', borderRadius: '1rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onLocationSelect={onLocationSelect} />
        <MapUpdater center={initialLocation || undefined} zoom={12} />
        
        {initialLocation && weatherData && (
          <WeatherMarker 
            coordinates={initialLocation}
            weather={weatherData.condition}
            temperature={weatherData.temperature}
            windSpeed={weatherData.windSpeed}
          />
        )}

        {disasters.map((disaster, index) => (
          <DisasterMarker key={index} disaster={disaster} />
        ))}
      </MapContainer>
    </motion.div>
  );
}; 