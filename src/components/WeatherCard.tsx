type Unit = "metric" | "imperial";

interface Props {
  weather: any;
  unit: Unit;
  aqi?: any | null;
}

const formatTime = (unix: number, timezoneOffset: number) => {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toUTCString().slice(17, 22); // HH:MM
};

const explainAqi = (aqi: number | undefined) => {
  if (!aqi) return "N/A";
  switch (aqi) {
    case 1:
      return "Good";
    case 2:
      return "Fair";
    case 3:
      return "Moderate";
    case 4:
      return "Poor";
    case 5:
      return "Very Poor";
    default:
      return "N/A";
  }
};

export default function WeatherCard({ weather, unit, aqi }: Props) {
  if (!weather) return null;

  const w = weather.weather[0];
  const main = w.main;
  const desc = w.description;
  const sys = weather.sys;
  const mainData = weather.main;

  const sunrise = formatTime(sys.sunrise, weather.timezone);
  const sunset = formatTime(sys.sunset, weather.timezone);

  return (
    <div className="weather-card">
      <img
        className="weather-icon"
        src={`https://openweathermap.org/img/wn/${w.icon}@4x.png`}
        alt="weather icon"
      />

      <h2 className="location">
        {weather.name}, {sys.country}
      </h2>

      <h1 className="temperature">
        {mainData.temp.toFixed(1)}°{unit === "metric" ? "C" : "F"}
      </h1>

      <div className="details">
        <span>Humidity: {mainData.humidity}%</span>
        <span>
          Wind: {weather.wind.speed.toFixed(1)} {unit === "metric" ? "m/s" : "mph"}
        </span>
      </div>

      <p className="description">
        <strong>{main}</strong> — {desc}
      </p>

      <div className="extra-box">
        <p>Feels like: {mainData.feels_like.toFixed(1)}°</p>
        <p>
          Min / Max: {mainData.temp_min.toFixed(1)}° /{" "}
          {mainData.temp_max.toFixed(1)}°
        </p>
        <p>Pressure: {mainData.pressure} hPa</p>
        <p>Visibility: {(weather.visibility / 1000).toFixed(1)} km</p>
        <p>Sunrise: {sunrise} • Sunset: {sunset}</p>
        <p>
          Air Quality: {explainAqi(aqi?.main?.aqi)}{" "}
          {aqi?.main?.aqi ? `(AQI: ${aqi.main.aqi})` : ""}
        </p>
      </div>
    </div>
  );
}
