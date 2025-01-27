import { FC, useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';

const WeatherContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  background-color: #fff;
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  flex-direction: column;
`;

const TimeSection = styled.div`
  display: flex;
  flex-direction: row;
`;

const TimeText = styled.h2`
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
`;

const WeatherSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Temperature = styled.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
`;

const WeatherIcon = styled.img`
  width: 8em;
  height: 8em;
`;

const WeatherDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #666;
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
        temp: data.daily.temperature_2m_max[0], // Using max temperature for the day
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
    const baseIconUrl = 'https://openweathermap.org/img/wn/';
    const dayIcons: { [key: number]: string } = {
      0: '01d',
      1: '02d',
      2: '03d',
      3: '04d',
      45: '50d',
      48: '50d',
      51: '09d',
      61: '10d',
      80: '09d',
      95: '11d',
    };
    const nightIcons: { [key: number]: string } = {
      0: '01n',
      1: '02n',
      2: '03n',
      3: '04n',
      45: '50n',
      48: '50n',
      51: '09n',
      61: '10n',
      80: '09n',
      95: '11n',
    };
    const iconCode = isDay ? dayIcons[code] : nightIcons[code];
    return `${baseIconUrl}${iconCode || '01d'}@2x.png`;
  };

  useEffect(() => {
    updateTime(); // Set initial time
    const intervalId = setInterval(updateTime, 1000); // Update time every second
    fetchLocation(); // Fetch location to get weather data

    return () => clearInterval(intervalId); // Cleanup interval on unmount
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
