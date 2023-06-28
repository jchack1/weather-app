import logo from "./logo.svg";
import "./App.css";
import {React, useState, useEffect} from "react";

function App() {
  const [locationName, updateLocationName] = useState("");
  const [daylight, updateDaylight] = useState(true);
  const [weatherMain, updateWeatherMain] = useState("");
  const [tempurature, updateTemperature] = useState("");
  const [weatherDescription, updateWeatherDescription] = useState("");
  const [time, updateTime] = useState("");

  const [apiError, updateApiError] = useState(false);

  const fetchLocationData = async (url) => {
    const response = await fetch(url);
    const jsonData = await response.json();

    console.log(jsonData);

    return jsonData;
  };

  const handleDetermineDaylight = (sunrise, sunset, currentTime) => {
    if (currentTime > sunrise && currentTime < sunset) {
      return true;
    }

    return false;
  };

  const formatTimestamp = (timestamp) => {
    const dateObject = new Date(Number(timestamp * 1000));

    const formatted = new Intl.DateTimeFormat("en-CA", {
      weekday: "short",
      // year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObject);

    return formatted;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const url = `https://weather-proxy.freecodecamp.rocks/api/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}`;

      const data = await fetchLocationData(url);

      //make sure we handle error if there is one with data

      updateLocationName(data.name);
      updateDaylight(() =>
        handleDetermineDaylight(data.sys.sunrise, data.sys.sunset, data.dt)
      );
      updateWeatherMain(data.weather[0].main);
      updateTemperature(data.main.temp);
      updateWeatherDescription(data.weather[0].description);
      updateTime(() => formatTimestamp(data.dt));
    });
  }, []);

  // need loading icon

  if (locationName.length === 0) {
    return <div>no location to show</div>;
  }

  return (
    <div className="App">
      <h1>your local weather</h1>

      <p>{locationName}</p>
      <p>{tempurature} C</p>
      <p>{weatherMain}</p>
      <p>{weatherDescription}</p>
      <p>{time}</p>

      {/* just testing for now, but we want to use this to change background color and text color */}
      <p>{daylight === true ? "It's daytime" : "It's nighttime"}</p>
    </div>
  );
}

export default App;
