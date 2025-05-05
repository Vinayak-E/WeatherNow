<template>
  <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl">
    <h2 class="text-xl lg:text-2xl font-semibold mb-6 text-gray-800 flex items-center">
      <Cloud class="w-6 h-6 mr-2 text-blue-500" />
      Current Weather
    </h2>
    
    <form @submit.prevent="fetchWeather" class="mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="relative flex-grow">
          <label for="location" class="text-sm text-gray-600 mb-1 block">Select Location</label>
          <div class="relative">
            <select 
              id="location"
              v-model="location" 
              class="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              required
            >
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <ChevronDown class="w-5 h-5" />
            </div>
          </div>
        </div>
        <div class="sm:self-end">
          <button 
            type="submit" 
            class="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center"
          >
            <Loader2 v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
            Get Weather
          </button>
        </div>
      </div>
    </form>
    
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
      <div class="flex items-center">
        <AlertCircle class="w-6 h-6 mr-2" />
        <p>{{ error }}</p>
      </div>
    </div>
    
    <div v-if="weather" class="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6">
      <div class="flex flex-col md:flex-row items-center md:justify-between">
        <div class="flex items-center mb-4 md:mb-0">
          <div class="mr-4">
            <img 
              :src="`http://openweathermap.org/img/wn/${weather.icon}@2x.png`" 
              alt="Weather Icon" 
              class="w-20 h-20 object-contain"
            >
          </div>
          <div>
            <h3 class="text-2xl lg:text-3xl font-bold text-gray-800">{{ weather.location }}</h3>
            <p class="text-lg text-gray-600 capitalize">{{ weather.description }}</p>
          </div>
        </div>
        
        <div class="flex flex-col items-center md:items-end">
          <div class="text-4xl lg:text-5xl font-bold text-blue-600">{{ weather.temperature }}°C</div>
          <div class="text-sm text-gray-500 mt-1">Last updated: {{ formattedTime }}</div>
        </div>
      </div>
      
      <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-3 flex items-center">
          <ArrowDown class="w-8 h-8 text-blue-500 mr-2" />
          <div>
            <div class="text-sm text-gray-500">Feels like</div>
            <div class="text-lg font-semibold">{{ weather.temperature - 1 }}°C</div>
          </div>
        </div>
        
        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-3 flex items-center">
          <Droplets class="w-8 h-8 text-blue-500 mr-2" />
          <div>
            <div class="text-sm text-gray-500">Humidity</div>
            <div class="text-lg font-semibold">65%</div>
          </div>
        </div>
        
        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-3 flex items-center">
          <Wind class="w-8 h-8 text-blue-500 mr-2" />
          <div>
            <div class="text-sm text-gray-500">Wind</div>
            <div class="text-lg font-semibold">15 km/h</div>
          </div>
        </div>
        
        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-3 flex items-center">
          <Sun class="w-8 h-8 text-blue-500 mr-2" />
          <div>
            <div class="text-sm text-gray-500">UV Index</div>
            <div class="text-lg font-semibold">Moderate</div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="!error && !loading" class="bg-blue-50 p-6 rounded-xl text-center">
      <CheckCircle class="w-16 h-16 mx-auto text-blue-400 mb-4" />
      <p class="text-lg text-gray-600">Select a location and click "Get Weather" to see the current conditions</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { request } from 'graphql-request';
import { 
  Cloud, 
  ChevronDown, 
  Loader2, 
  AlertCircle, 
  ArrowDown, 
  Droplets, 
  Wind, 
  Sun, 
  CheckCircle 
} from 'lucide-vue-next';

export default {
  components: {
    Cloud,
    ChevronDown,
    Loader2,
    AlertCircle,
    ArrowDown,
    Droplets,
    Wind,
    Sun,
    CheckCircle
  },
  setup() {
    const location = ref('Delhi');
    const cities = ref(['Delhi', 'Moscow', 'Paris', 'New York', 'Sydney', 'Riyadh']);
    const weather = ref(null);
    const error = ref(null);
    const loading = ref(false);
    const lastUpdate = ref(new Date());

    const formattedTime = computed(() => {
      return lastUpdate.value.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    });

    async function fetchWeather() {
      loading.value = true;
      error.value = null;
      weather.value = null;
      
      try {
        const query = `
          mutation ($location: String!) {
            fetchWeather(location: $location) {
              location
              temperature
              description
              icon
            }
          }
        `;
        
        const response = await request('http://localhost:4000/graphql', query, { 
          location: location.value 
        });
        
        weather.value = response.fetchWeather;
        lastUpdate.value = new Date();
      } catch (err) {
        error.value = err.response?.errors?.[0]?.message || 'Failed to fetch weather data';
      } finally {
        loading.value = false;
      }
    }
    
    fetchWeather();

    return {
      location,
      cities,
      weather,
      error,
      loading,
      formattedTime,
      fetchWeather
    };
  }
};
</script>