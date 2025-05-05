
import axios, { AxiosError } from 'axios';
import WeatherModel from '../models/Weather';
import { IWeather } from '../interfaces/IWeather';
import { ALLOWED_LOCATIONS } from '../constants/locations';
import { OPENWEATHERMAP_API_KEY, OPENWEATHERMAP_BASE_URL } from '../constants/api';

const validateLocation = (location: string): boolean => {
  return ALLOWED_LOCATIONS.includes(location);
};

const validateDateRange = (from: string, to: string): boolean => {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    return false;
  }

  const differenceInTime = toDate.getTime() - fromDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  return differenceInDays >= 0 && differenceInDays <= 30;
};

export const resolvers = {
  getWeather: async ({ location }: { location: string }) => {
    try {
      if (!validateLocation(location)) {
        throw new Error(`Invalid location. Please choose from ${ALLOWED_LOCATIONS.join(', ')}.`);
      }

      const latestWeather = await WeatherModel.findOne({ location })
        .sort({ date: -1 })
        .exec();

      if (latestWeather) {
        const currentTime = new Date();
        const weatherTime = new Date(latestWeather.date);
        const timeDifference = (currentTime.getTime() - weatherTime.getTime()) / (1000 * 60);

        if (timeDifference < 30) {
          return {
            id: latestWeather.id,
            location: latestWeather.location,
            temperature: latestWeather.temperature,
            description: latestWeather.description,
            icon: latestWeather.icon,
            date: latestWeather.date.toISOString(),
          };
        }
      }

      return resolvers.fetchWeather({ location });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching weather:', error.message);
        throw new Error(`Failed to get weather data: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while fetching weather data.');
      }
    }
  },

  getWeatherHistory: async ({ location, from, to }: { location: string; from: string; to: string }) => {
    try {
      if (!validateLocation(location)) {
        throw new Error(`Invalid location. Please choose from ${ALLOWED_LOCATIONS.join(', ')}.`);
      }

      if (!validateDateRange(from, to)) {
        throw new Error('Invalid date range. The maximum date range is 30 days.');
      }

      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1);

      const historyData = await WeatherModel.find({
        location,
        date: { $gte: fromDate, $lt: toDate },
      }).sort({ date: 1 });

      return historyData.map((weather) => ({
        id: weather.id,
        location: weather.location,
        temperature: weather.temperature,
        description: weather.description,
        icon: weather.icon,
        date: weather.date.toISOString(),
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching weather history:', error.message);
        throw new Error(`Failed to get weather history: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while fetching weather history.');
      }
    }
  },

  fetchWeather: async ({ location }: { location: string }) => {
    try {
      if (!validateLocation(location)) {
        throw new Error(`Invalid location. Please choose from ${ALLOWED_LOCATIONS.join(', ')}.`);
      }

      if (!OPENWEATHERMAP_API_KEY) {
        throw new Error('OpenWeatherMap API key is missing. Please check your environment variables.');
      }

      const response = await axios.get(OPENWEATHERMAP_BASE_URL, {
        params: {
          q: location,
          appid: OPENWEATHERMAP_API_KEY,
          units: 'metric',
        },
      });

      const data = response.data;

      const weatherData: IWeather = new WeatherModel({
        location,
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        date: new Date(),
      });

      await weatherData.save();

      return {
        id: weatherData.id,
        location: weatherData.location,
        temperature: weatherData.temperature,
        description: weatherData.description,
        icon: weatherData.icon,
        date: weatherData.date.toISOString(),
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
        } else if (error.request) {
          throw new Error('Network error. Please check your internet connection.');
        } else {
          throw new Error(`Axios error: ${error.message}`);
        }
      } else if (error instanceof Error) {
        throw new Error(`Error: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred while fetching weather from the API.');
      }
    }
  },
};
