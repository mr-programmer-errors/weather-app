type Unit = "metric" | "imperial";

interface Props {
  data: any[];
  unit: Unit;
}

export default function Forecast({ data, unit }: Props) {
  if (!data || data.length === 0) return null;

  const daily = data.filter((_, i) => i % 8 === 0); // every 24 hours

  return (
    <div className="forecast">
      <h2 className="forecast-title">5-Day Forecast</h2>
      <div className="forecast-container">
        {daily.map((item, index) => (
          <div className="forecast-card" key={index}>
            <strong>{item.dt_txt.split(" ")[0]}</strong>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
              alt=""
            />
            <p>
              {item.main.temp.toFixed(1)}° {unit === "metric" ? "C" : "F"}
            </p>
            <small>{item.weather[0].description}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
