# Weather Dashboard Application

A full-stack weather dashboard that displays **current** and **historical** weather data for selected locations using the OpenWeatherMap API.

## 🌤️ Features

- 🔍 Current weather display: temperature, weather description, and icon
- 🕒 Historical weather view with location and date range filtering
- 📅 Date range validation (max 30 days)
- 📱 Responsive UI built with Tailwind CSS
- ⚡ GraphQL API for efficient data fetching
- 🗃️ MongoDB database for weather data persistence

## 🧰 Technologies Used

### Backend
- Node.js
- Express.js
- GraphQL
- MongoDB with Mongoose
- TypeScript

### Frontend
- Vue.js 3
- Tailwind CSS
- Axios

### 🔧 Backend Setup

1. Clone the repository: git clone https://github.com/Vinayak-E/weatherNow.git
cd WeatherNow/server

Install backend dependencies:

npm install
Create a .env file based on the following:

env
Copy
Edit
PORT=4000
MONGO_URI=mongodb://localhost:27017/weather-app
OPENWEATHERMAP_API_KEY=your_api_key_here
Start the backend server:

npm run dev


### 🎨 Frontend Setup

cd ../client
npm install
npm run dev

🌐 The frontend will run at:
http://localhost:5173 
