import "./App.css";
import {React, useState, useEffect} from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  flex-direction: column;
  padding: 20px;

  text-align: center;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;

  h1 {
    font-size: 2rem;
  }

  @media (max-width: 415px) {
    h1 {
      font-size: 1.6rem;
    }
  }
`;

const WeatherTempContainer = styled.div`
  display: flex;
  max-width: 700px;
  justify-content: space-between;
  align-items: end;

  @media (max-width: 415px) {
    justify-content: center;
    align-items: center;
  }
`;

const TempContainer = styled.div`
  display: flex;
  margin: 10px;

  @media (max-width: 415px) {
    margin: 0;
  }
`;

const Temp = styled.p`
  font-size: 7.5rem;
  margin: 20px 0;

  @media (max-width: 415px) {
    margin: 0 8px 0 0;
    font-size: 5.5rem;
  }
`;

const WeatherImg = styled.img`
  width: 10rem;

  @media (max-width: 415px) {
    width: 4rem;
  }
`;

const Degrees = styled.p`
  cursor: pointer;
  font-size: 2rem;
  opacity: 70%;
  margin-top: 47px;

  @media (max-width: 415px) {
    margin-top: 15px;
    font-size: 1.8rem;
  }
`;

const WeatherContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;

  img {
    filter: ${(props) =>
      props.daylight
        ? "drop-shadow(5px 5px 16px #717ab3)"
        : "drop-shadow(5px 5px 16px #121314)"};
  }
`;

const DescriptionContainer = styled.div`
  fontsize: 1.2rem;
`;

const LoadingIcon = () => {
  return (
    <div className="loading-icon">
      <svg
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

function App() {
  const [locationName, updateLocationName] = useState("");
  const [daylight, updateDaylight] = useState(true);
  const [weatherMain, updateWeatherMain] = useState("");
  const [temperature, updateTemperature] = useState("");
  const [weatherDescription, updateWeatherDescription] = useState("");
  const [icon, updateIcon] = useState("");
  const [isCelsius, updateIsCelsius] = useState(true);

  const [apiError, updateApiError] = useState(false);
  const [loading, updateLoading] = useState(false);

  const fetchLocationData = async (url) => {
    const response = await fetch(url);

    const jsonData = await response.json();

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
      updateLoading(true);

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
      updateIcon(data.weather[0].icon);

      updateLoading(false);
    });
  }, []);

  if (apiError) {
    return <PageContainer className={daylight ? "daylight" : "nighttime"} />;
  }

  if (locationName.length === 0 && !loading) {
    return (
      <PageContainer className={daylight ? "daylight" : "nighttime"}>
        <h1 className="fade-in">your local weather</h1>

        <p className="fade-in">
          allow location access to view your local weather{" "}
        </p>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer className={daylight ? "daylight" : "nighttime"}>
        <LoadingIcon />
      </PageContainer>
    );
  }

  return (
    <PageContainer className={daylight ? "daylight" : "nighttime"}>
      <h1 className="fade-in">{locationName}</h1>

      <WeatherTempContainer className="fade-in">
        <WeatherContainer daylight={daylight}>
          <WeatherImg src={icon} alt={`${weatherMain} icon`} />
        </WeatherContainer>

        <TempContainer className="fade-in">
          <Temp>{temperature}</Temp>

          <Degrees
            onClick={() => convertCelsiusFahrenheit(isCelsius, temperature)}
          >
            &deg;
            {isCelsius ? "C" : "F"}
          </Degrees>
        </TempContainer>
      </WeatherTempContainer>

      <DescriptionContainer className="description-container fade-in">
        <p>{weatherDescription}</p>
      </DescriptionContainer>
    </PageContainer>
  );
}

export default App;
