🌤️ WeatherNow Weather Application
A full-stack weather dashboard that displays current and historical weather data for selected locations using the OpenWeatherMap API.
🌤️ Features

🔍 Current weather display: temperature, weather description, and icon
🕒 Historical weather view with location and date range filtering
📅 Date range validation (max 30 days)
📱 Responsive UI built with Tailwind CSS
⚡ GraphQL API for efficient data fetching
🗃️ MongoDB database for weather data persistence

🧰 Technologies Used
Backend

Node.js
Express.js
GraphQL
MongoDB with Mongoose
TypeScript

Frontend

Vue.js 3
Tailwind CSS
Axios

🔧 Backend Setup

Clone the repository:
git clone https://github.com/Vinayak-E/weatherNow.git
cd WeatherNow/server


Install backend dependencies:
npm install


Create a .env file with the following content:
PORT=4000
MONGODB_URI=mongodb://localhost:27017/weather-app
OPENWEATHERMAP_API_KEY=your_api_key_here


Start the backend server:
npm run dev



🎨 Frontend Setup

Navigate to the client directory:
cd ../client


Install frontend dependencies:
npm install


Start the frontend development server:
npm run dev


The frontend will be available at:
http://localhost:5173



🌐 Live Demo
The frontend is hosted at:http://localhost:5173
