import dotenv from 'dotenv';
dotenv.config();

export const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
export const OPENWEATHERMAP_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
