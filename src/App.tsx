import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import HourlyForecast from "./components/HourlyForecast";
import "./App.css";

type Unit = "metric" | "imperial";

const API_KEY = "19c2db23967a887d904307b84db89d2e"; // <- put your key here

type Coords = { lat: number; lon: number } | null;

export default function App() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [weather, setWeather] = useState<any | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [hourly, setHourly] = useState<any[]>([]);
  const [aqi, setAqi] = useState<any | null>(null);
  const [bgClass, setBgClass] = useState("default-bg");
  const [loading, setLoading] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCity, setLastCity] = useState<string | null>(null);
  const [lastCoords, setLastCoords] = useState<Coords>(null);

  const mapBackground = (main: string, isNight: boolean) => {
    if (isNight) return "night-bg";
    switch (main) {
      case "Clear":
        return "clear-bg";
      case "Clouds":
        return "cloud-bg";
      case "Rain":
        return "rain-bg";
      case "Drizzle":
        return "drizzle-bg";
      case "Thunderstorm":
        return "thunder-bg";
      case "Snow":
        return "snow-bg";
      case "Mist":
      case "Smoke":
      case "Haze":
      case "Dust":
      case "Fog":
      case "Sand":
      case "Ash":
      case "Squall":
      case "Tornado":
        return "fog-bg";
      default:
        return "default-bg";
    }
  };

  const fetchAllByCoords = async (
    lat: number,
    lon: number,
    u: Unit = unit
  ) => {
    setLoading(true);
    setError(null);
    setShowForecast(false);
    setLastCoords({ lat, lon });
    setLastCity(null);

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${u}&appid=${API_KEY}`
      );
      const w = await weatherRes.json();
      if (w.cod !== 200) throw new Error(w.message || "Weather error");
      setWeather(w);

      const isNight = w.dt > w.sys.sunset;
      setBgClass(mapBackground(w.weather[0].main, isNight));

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${u}&appid=${API_KEY}`
      );
      const f = await forecastRes.json();
      setForecast(f.list || []);
      setHourly((f.list || []).slice(0, 8)); // next ~24 hours (8 * 3h)

      const aqiRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const a = await aqiRes.json();
      setAqi(a.list?.[0] || null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load weather");
      setWeather(null);
      setForecast([]);
      setHourly([]);
      setAqi(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllByCity = async (city: string, u: Unit = unit) => {
    setLoading(true);
    setError(null);
    setShowForecast(false);
    setLastCity(city);
    setLastCoords(null);

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&units=${u}&appid=${API_KEY}`
      );
      const w = await weatherRes.json();
      if (w.cod !== 200) throw new Error(w.message || "City not found");
      setWeather(w);

      const isNight = w.dt > w.sys.sunset;
      setBgClass(mapBackground(w.weather[0].main, isNight));

      const lat = w.coord.lat;
      const lon = w.coord.lon;

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${u}&appid=${API_KEY}`
      );
      const f = await forecastRes.json();
      setForecast(f.list || []);
      setHourly((f.list || []).slice(0, 8));

      const aqiRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const a = await aqiRes.json();
      setAqi(a.list?.[0] || null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load weather");
      setWeather(null);
      setForecast([]);
      setHourly([]);
      setAqi(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city: string) => {
    fetchAllByCity(city);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchAllByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError("Failed to get your location");
      }
    );
  };

  const handleToggleUnit = () => {
    const next: Unit = unit === "metric" ? "imperial" : "metric";
    setUnit(next);

    // refetch with new unit if we already have a location
    if (lastCoords) {
      fetchAllByCoords(lastCoords.lat, lastCoords.lon, next);
    } else if (lastCity) {
      fetchAllByCity(lastCity, next);
    }
  };

  return (
    <div className={`app ${bgClass}`}>
      <div className="content">
        <h1 className="title">Weather App</h1>

        <div className="top-actions">
          <button className="unit-btn" onClick={handleToggleUnit}>
            Switch to °{unit === "metric" ? "F" : "C"}
          </button>
          <button className="location-btn" onClick={handleUseLocation}>
            📍 Use My Location
          </button>
        </div>

        <SearchBar onSearch={handleSearch} />

        {error && <p className="error">{error}</p>}

        {loading && <div className="loader" />}

        {!loading && weather && (
          <>
            <WeatherCard weather={weather} unit={unit} aqi={aqi} />
            <HourlyForecast data={hourly} unit={unit} />

            <button
              className="forecast-toggle"
              onClick={() => setShowForecast((v) => !v)}
            >
              {showForecast ? "Hide 5-Day Forecast" : "Show 5-Day Forecast"}
            </button>

            {showForecast && forecast.length > 0 && (
              <Forecast data={forecast} unit={unit} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
