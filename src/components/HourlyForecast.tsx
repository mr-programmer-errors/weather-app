type Unit = "metric" | "imperial";

interface Props {
  data: any[];
  unit: Unit;
}

const formatHour = (dtTxt: string) => {
  const d = new Date(dtTxt.replace(" ", "T") + "Z");
  return d.toUTCString().slice(17, 22); // HH:MM
};

export default function HourlyForecast({ data, unit }: Props) {
  if (!data || data.length === 0) return null;

  return (
    <div className="hourly">
      <h2 className="forecast-title">Next 24 Hours</h2>
      <div className="hourly-container">
        {data.map((item, i) => (
          <div className="hourly-card" key={i}>
            <div>{formatHour(item.dt_txt)}</div>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
              alt=""
            />
            <div>
              {item.main.temp.toFixed(1)}° {unit === "metric" ? "C" : "F"}
            </div>
            <small>{item.weather[0].main}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
