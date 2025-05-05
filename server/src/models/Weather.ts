import mongoose, { Schema,} from 'mongoose';
import { IWeather } from '../interfaces/IWeather';

const WeatherSchema: Schema = new Schema({
  location: { type: String, required: true },
  temperature: { type: Number, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IWeather>('Weather', WeatherSchema);