import logo from "./logo.svg";
import "./App.css";
import {React, useState, useEffect} from "react";
import styled from "styled-components";

// still need to:
// icons for weather and loading
// organize code
// general styling

const WeatherTempContainer = styled.div`
  display: flex;
  max-width: 700px;
  justify-content: space-between;
`;

const TempContainer = styled.div`
  display: flex;
  margin: 10px;
`;

const Degrees = styled.p`
  cursor: pointer;
  font-size: 2rem;
  opacity: 90%;
  margin-top: 92px;
`;

const WeatherContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const WeatherMainContainer = styled.div`
  font-size: 1.2rem;
  text-align: center;
  margin-top: 0;

  p {
    margin-top: 0;
  }
`;

function App() {
  const [locationName, updateLocationName] = useState("");
  const [daylight, updateDaylight] = useState(true);
  const [weatherMain, updateWeatherMain] = useState("");
  const [temperature, updateTemperature] = useState("");
  const [weatherDescription, updateWeatherDescription] = useState("");
  const [time, updateTime] = useState("");
  const [icon, updateIcon] = useState("");
  const [isCelsius, updateIsCelsius] = useState(true);

  const [apiError, updateApiError] = useState(false);

  const fetchLocationData = async (url) => {
    const response = await fetch(url);

    const jsonData = await response.json();
    console.log(jsonData);

    if (!response.ok || jsonData.error) {
      updateApiError("Something went wrong");
      return "error";
    }

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
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObject);

    return formatted;
  };

  const convertCelsiusFahrenheit = (currentIsCelsius, temperature) => {
    if (currentIsCelsius) {
      updateTemperature(Math.round(temperature * 1.8 + 32));
      updateIsCelsius(false);
    }

    if (!currentIsCelsius) {
      updateTemperature(Math.round((temperature - 32) / 1.8));
      updateIsCelsius(true);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async function (position) {
      const url = `https://weather-proxy.freecodecamp.rocks/api/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}`;

      const data = await fetchLocationData(url);

      //make sure we handle error if there is one with data

      if (data === "error") return;

      updateLocationName(data.name);
      updateDaylight(() =>
        handleDetermineDaylight(data.sys.sunrise, data.sys.sunset, data.dt)
      );
      updateWeatherMain(data.weather[0].main);
      updateTemperature(Math.round(data.main.temp));
      updateWeatherDescription(data.weather[0].description);
      updateTime(() => formatTimestamp(data.dt));
      updateIcon(data.weather[0].icon);
    });
  }, []);

  // need loading icon

  if (apiError) {
    return <div>{apiError}</div>;
  }

  if (locationName.length === 0) {
    return <div>no location to show</div>;
  }

  return (
    <div className={daylight ? "daylight container" : "nighttime container"}>
      <h1>your local weather</h1>

      <>
        <div className="location-container">
          <p>{locationName}</p>
        </div>

        <WeatherTempContainer>
          <WeatherContainer>
            <div>
              <img src={icon} alt={`${weatherMain} icon`} />
            </div>
            <WeatherMainContainer>
              <p>{weatherMain}</p>
            </WeatherMainContainer>
          </WeatherContainer>

          <TempContainer>
            <p style={{fontSize: "5rem"}}>{temperature}</p>

            <Degrees
              onClick={() => convertCelsiusFahrenheit(isCelsius, temperature)}
            >
              &deg;
              {isCelsius ? "C" : "F"}
            </Degrees>
          </TempContainer>
        </WeatherTempContainer>

        <div className="time-container">
          <p>{time}</p>
        </div>
      </>

      {/* <p>{weatherDescription}</p> */}
    </div>
  );
}

export default App;
