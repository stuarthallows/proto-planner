import { useEffect, useState } from "react";
import "./App.css";
import type { Forecast } from "./models/Forecast";

function App() {
  const [forecasts, setForecasts] = useState<Array<Forecast>>([]);
  const weatherEmojis = ['☀️', '⛅', '🌤️', '🌧️', '⛈️', '🌩️', '❄️', '🌨️', '🌪️', '🌈'];
  const randomEmoji = weatherEmojis[Math.floor(Math.random() * weatherEmojis.length)];

  const requestWeather = async () => {
    const weather = await fetch("api/weatherforecast");
    console.log(weather);

    const weatherJson = await weather.json();
    console.log(weatherJson);

    setForecasts(weatherJson);
  };

  useEffect(() => {
    requestWeather();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather {randomEmoji}</h1>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temp. (C)</th>
              <th>Temp. (F)</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            {(
              forecasts ?? [
                {
                  date: "N/A",
                  temperatureC: "",
                  temperatureF: "",
                  summary: "No forecasts",
                },
              ]
            ).map((w) => {
              return (
                <tr key={w.date}>
                  <td>{w.date}</td>
                  <td>{w.temperatureC}</td>
                  <td>{w.temperatureF}</td>
                  <td>{w.summary}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App
