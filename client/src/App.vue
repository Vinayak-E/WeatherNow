<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 via-blue-300 to-blue-200 p-4 lg:p-8">
    <div class="container mx-auto max-w-6xl">
      <header class="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-8 py-4">
        <div class="flex items-center mb-4 sm:mb-0">
          <Cloud class="w-12 h-12 text-white" />
          <h1 class="text-3xl sm:text-4xl font-bold text-white ml-2 tracking-tighter">
            <span class="font-light">Weather</span><span class="font-extrabold">Now</span>
          </h1>
        </div>
        <div class="text-white text-sm backdrop-blur-sm bg-white/10 py-2 px-4 rounded-full">
          <span>{{ currentDate }}</span>
        </div>
      </header>

      <div class="space-y-6">
        <WeatherDisplay />
        <WeatherHistory />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Cloud } from 'lucide-vue-next';
import WeatherDisplay from './components/WeatherDisplay.vue';
import WeatherHistory from './components/WeatherHistory.vue';

export default {
  components: { 
    WeatherDisplay, 
    WeatherHistory,
    Cloud
  },
  setup() {
    const currentDate = ref('');

    onMounted(() => {
      const now = new Date();
      currentDate.value = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    });

    return {
      currentDate
    };
  }
};
</script>