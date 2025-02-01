import { FC, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

const WeatherContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 20px;
  flex-direction: row;
  border: 1px solid #e7e7e7;
  padding: 20px;
  width: 100%;
  margin-bottom: 1em;

  @media (min-width: 768px) {
    width: 49%;
    margin-left: 1em;
    margin-bottom: 0;
  }
`;

const TimeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const TimeText = styled.h2`
  margin: 0;
  font-size: 2em;
  font-weight: 600;
`;

const WeatherSection = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column-reverse;
  height: 100%;
  justify-content: space-around;
`;

const Temperature = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const WeatherIcon = styled.img`
  width: 10em;
  height: 10em;
`;

const WeatherDescription = styled.p`
  margin: 0;
  font-size: 1em;
  color: #404040;

  @media (max-width: 768px) {
    font-size: 0.8em;
  }
`;

const WeatherCard: FC = () => {
  const [time, setTime] = useState<string>('');
  const [weather, setWeather] = useState<{
    temp: number;
    description: string;
    weatherCode: number;
    isDayTime: boolean;
  }>({
    temp: 0,
    description: 'Loading...',
    weatherCode: 0,
    isDayTime: true,
  });
  const [error, setError] = useState<string>('');

  // -------------- Utility Functions ----------------

  const updateTime = () => {
    const now = new Date();
    // e.g. "08:35"
    setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const mapWeatherCodeToDescription = (code: number): string => {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Drizzle: Light',
      53: 'Drizzle: Moderate',
      55: 'Drizzle: Dense intensity',
      56: 'Freezing Drizzle: Light',
      57: 'Freezing Drizzle: Dense intensity',
      61: 'Rain: Slight',
      63: 'Rain: Moderate',
      65: 'Rain: Heavy intensity',
      66: 'Freezing Rain: Light',
      67: 'Freezing Rain: Heavy intensity',
      71: 'Snow fall: Slight',
      73: 'Snow fall: Moderate',
      75: 'Snow fall: Heavy intensity',
      80: 'Rain showers: Slight',
      81: 'Rain showers: Moderate',
      82: 'Rain showers: Violent',
      95: 'Thunderstorm: Slight or moderate',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return weatherCodes[code] || 'Unknown weather';
  };

  const mapWeatherCodeToIcon = (code: number, isDay: boolean): string => {
    const baseIconUrl = 'https://bmcdn.nl/assets/weather-icons/v3.0/fill/svg/';

    // Basic mapping examples – customize as you like
    const dayIcons: { [key: number]: string } = {
      0: 'clear-day',
      1: 'partly-cloudy-day',
      2: 'partly-cloudy-day',
      3: 'overcast',
      45: 'fog-day',
      48: 'fog-day',
      51: 'drizzle',
      61: 'rain',
      80: 'rain',
      95: 'thunderstorms',
    };

    const nightIcons: { [key: number]: string } = {
      0: 'clear-night',
      1: 'partly-cloudy-night',
      2: 'partly-cloudy-night',
      3: 'overcast',
      45: 'fog-night',
      48: 'fog-night',
      51: 'drizzle',
      61: 'rain',
      80: 'rain',
      95: 'thunderstorms',
    };

    const iconCode = isDay ? dayIcons[code] : nightIcons[code];
    // Fallback to 'clear-day' if we don't have a specific match
    return `${baseIconUrl}${iconCode || 'clear-day'}.svg`;
  };

  // -------------- Main Fetch Function --------------

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    try {
      // Request hourly temperature_2m and weathercode, plus sunrise/sunset daily
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
          `latitude=${latitude}&longitude=${longitude}` +
          `&hourly=temperature_2m,weathercode` +
          `&daily=sunrise,sunset` +
          `&timezone=auto`
      );
      const data = await response.json();

      // ---------------- Get current hour's data ----------------
      const currentTime = new Date();
      const hourlyTimes = data.hourly.time.map((t: string) => new Date(t));

      // Find the index of the hour that is "on or after" the current time
      let closestHourIndex = hourlyTimes.findIndex(
        (t: Date) => t.getTime() >= currentTime.getTime()
      );

      // If all times are in the past (late in the day), pick the last hour
      if (closestHourIndex === -1) {
        closestHourIndex = hourlyTimes.length - 1;
      }

      const currentTemp = data.hourly.temperature_2m[closestHourIndex];
      const currentCode = data.hourly.weathercode[closestHourIndex];

      // ---------------- Determine Day or Night ----------------
      // Using today's sunrise/sunset. If you want to handle multiple days,
      // you'd need logic to pick the correct day, but for simplicity:
      const todaySunrise = new Date(data.daily.sunrise[0]);
      const todaySunset = new Date(data.daily.sunset[0]);
      const isDayTime = currentTime >= todaySunrise && currentTime < todaySunset;

      // ---------------- Update State ----------------
      setWeather({
        temp: currentTemp,
        description: mapWeatherCodeToDescription(currentCode),
        weatherCode: currentCode,
        isDayTime,
      });
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      setError('Could not fetch weather data.');
    }
  }, []);

  const fetchLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          console.error('Error fetching location:', err);
          setError('Could not fetch your location. Please enable location access.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, [fetchWeather]);

  useEffect(() => {
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    fetchLocation();

    return () => clearInterval(intervalId);
  }, [fetchLocation]);

  return (
    <WeatherContainer>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <WeatherIcon
            src={mapWeatherCodeToIcon(weather.weatherCode, weather.isDayTime)}
            alt={weather.description}
          />

          <WeatherSection>
            <Temperature>{weather.temp}°C</Temperature>
            <WeatherDescription>{weather.description}</WeatherDescription>
            <TimeSection>
              <TimeText>{time}</TimeText>
            </TimeSection>
          </WeatherSection>
        </>
      )}
    </WeatherContainer>
  );
};

export default WeatherCard;
