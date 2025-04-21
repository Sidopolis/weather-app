import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoSearch, IoLocationSharp } from 'react-icons/io5';

interface Location {
  display_name: string;
  lat: number;
  lon: number;
}

interface SearchBarProps {
  onLocationSelect: (coordinates: [number, number]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (searchTerm) {
      debounceTimer.current = setTimeout(() => {
        searchLocation(searchTerm);
      }, 300);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const handleSuggestionClick = (location: Location) => {
    onLocationSelect([Number(location.lat), Number(location.lon)]);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="search-bar" style={{
      width: '100%',
      maxWidth: '600px',
      margin: '20px auto',
      position: 'relative',
      zIndex: 1000
    }}>
      <div className="search-container" style={{
        background: '#1a1a1a',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #333'
        }}>
          <IoSearch size={20} color="#666" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search any location..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              padding: '8px 12px',
              background: 'transparent',
              color: '#fff'
            }}
          />
          {searchTerm && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => {
                setSearchTerm('');
                setSuggestions([]);
              }}
              style={{
                border: 'none',
                background: 'none',
                padding: '4px',
                cursor: 'pointer'
              }}
            >
              <IoClose size={20} color="#666" />
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: '#1a1a1a',
                maxHeight: '300px',
                overflowY: 'auto'
              }}
            >
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #333',
                    color: '#fff',
                    transition: 'all 0.2s ease'
                  }}
                  whileHover={{
                    backgroundColor: '#333'
                  }}
                >
                  <IoLocationSharp size={16} color="#4a9eff" />
                  <span style={{ fontSize: '14px' }}>{suggestion.display_name}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '12px',
                textAlign: 'center',
                color: '#666',
                background: '#1a1a1a'
              }}
            >
              Searching...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};