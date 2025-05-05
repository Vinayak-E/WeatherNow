import { Document } from "mongoose";

export interface IWeather extends Document {
    id?:string;
    location: string;
    temperature: number;
    description: string;
    icon: string;
    date: Date;
  }

  export interface WeatherInput {
    location: string;
  }
  
  export interface WeatherHistoryInput {
    location?: string;
    from?: string;
    to?: string;
  }