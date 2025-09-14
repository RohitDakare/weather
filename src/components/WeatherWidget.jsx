
import React, { useState, useEffect, useCallback } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, MapPin, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

const weatherIcons = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Snow: CloudSnow,
  Wind: Wind,
  Haze: Cloud,
  Mist: Cloud,
};

export default function WeatherWidget({ onWeatherData }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, the API key would be stored securely on the backend.
      // This is a placeholder for the user-provided key.
      const apiKey = "e3e77d59afda7cc78be1bccd97a27d90";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
      );
      if (!response.ok) {
        throw new Error("Could not fetch weather data.");
      }
      const data = await response.json();
      
      const weatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        location: data.name,
      };
      setWeather(weatherData);
      onWeatherData && onWeatherData(weatherData);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, [onWeatherData]);
  
  const getLocation = useCallback(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError("Location access denied. Please enable it in your browser settings.");
          setLoading(false);
          // Fallback to a default location if denied
          fetchWeather(40.7128, -74.0060); // New York
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, [fetchWeather]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-r from-blue-400 to-purple-500 text-white">
        <div className="flex items-center justify-center space-x-2">
           <Loader2 className="h-5 w-5 animate-spin" />
           <span>Getting your local weather...</span>
        </div>
      </Card>
    );
  }

  if (error) {
     return (
        <Card className="p-6 bg-gradient-to-r from-red-400 to-orange-500 text-white">
          <div className="text-center">
            <p className="mb-2">{error}</p>
            <Button onClick={getLocation} variant="secondary">Try Again</Button>
          </div>
        </Card>
     )
  }

  if (!weather) return null;

  const IconComponent = weatherIcons[weather.condition] || Sun;

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1 flex items-center"><MapPin className="w-4 h-4 mr-1"/> {weather.location}</p>
          <p className="text-3xl font-bold">{weather.temperature}°F</p>
          <p className="text-sm opacity-90 capitalize">{weather.description}</p>
        </div>
        <div className="text-right">
          <IconComponent className="w-12 h-12 mb-2" />
          <p className="text-xs opacity-75">
            {weather.humidity}% humidity
          </p>
        </div>
      </div>
    </Card>
  );
}
