import { FC, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

const WeatherContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 20px;
  flex-direction: column;
`;

const TimeSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 16em;
  justify-content: space-between;
`;

const TimeText = styled.h2`
  margin: 0;
  font-size: 2em;
  font-weight: bold;
`;

const WeatherSection = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  width: 16em;
  justify-content: space-between;
`;

const Temperature = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
`;

const WeatherIcon = styled.img`
  width: 8em;
  height: 8em;
`;

const WeatherDescription = styled.p`
  margin: 0;
  font-size: 1em;
  color: #404040;
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

  const updateTime = () => {
    const now = new Date();
    setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weathercode&timezone=auto`
      );
      const data = await response.json();

      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentFormattedTime = `${String(currentHour).padStart(2, '0')}:${String(
        currentMinutes
      ).padStart(2, '0')}`;

      const isDayTime =
        data.daily.sunrise[0].slice(11) < currentFormattedTime &&
        currentFormattedTime < data.daily.sunset[0].slice(11);

      setWeather({
        temp: data.daily.temperature_2m_max[0],
        description: mapWeatherCodeToDescription(data.daily.weathercode[0]),
        weatherCode: data.daily.weathercode[0],
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
    return `${baseIconUrl}${iconCode || 'clear-day'}.svg`;
  };

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
          <TimeSection>
            <WeatherIcon
              src={mapWeatherCodeToIcon(weather.weatherCode, weather.isDayTime)}
              alt={weather.description}
            />
            <TimeText>{time}</TimeText>
          </TimeSection>
          <WeatherSection>
            <Temperature>{weather.temp}°C</Temperature>
            <WeatherDescription>{weather.description}</WeatherDescription>
          </WeatherSection>
        </>
      )}
    </WeatherContainer>
  );
};

export default WeatherCard;
