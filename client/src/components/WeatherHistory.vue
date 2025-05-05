<template>
  <div class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl">
    <h2 class="text-xl lg:text-2xl font-semibold mb-6 text-gray-800 flex items-center">
      <i class="fas fa-clipboard mr-2 text-blue-500"></i>
      Weather History
    </h2>
    
    <form @submit.prevent="fetchHistory" class="mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="relative">
          <label for="history-location" class="text-sm text-gray-600 mb-1 block">Location</label>
          <div class="relative">
            <select 
              id="history-location"
              v-model="filters.location" 
              class="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">All Locations</option>
              <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <i class="fas fa-map-marker-alt"></i>
            </div>
          </div>
        </div>
        
        <div>
          <label for="date-from" class="text-sm text-gray-600 mb-1 block">From Date</label>
          <div class="relative">
            <input 
              id="date-from"
              type="date" 
              v-model="filters.from" 
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              :max="maxFromDate"
            />
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <i class="fas fa-calendar"></i>
            </div>
          </div>
        </div>
        
        <div>
          <label for="date-to" class="text-sm text-gray-600 mb-1 block">To Date</label>
          <div class="relative">
            <input 
              id="date-to"
              type="date" 
              v-model="filters.to" 
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              :min="filters.from"
              :max="today"
            />
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <i class="fas fa-calendar"></i>
            </div>
          </div>
          <div v-if="dateRangeError" class="text-red-500 text-xs mt-1">
            {{ dateRangeError }}
          </div>
        </div>
        
        <div class="self-end">
          <button 
            type="submit" 
            class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center"
            :disabled="loading || !!dateRangeError"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <span>Filter History</span>
          </button>
        </div>
      </div>
    </form>
    
    <div v-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle w-6 h-6 mr-2"></i>
        <p>{{ error }}</p>
      </div>
    </div>
    
    <div class="overflow-x-auto" v-if="history.length">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr class="bg-gradient-to-r from-blue-50 to-blue-100">
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Temperature
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Weather
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Date & Time
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(record, index) in paginatedHistory" :key="record.id" 
              :class="index % 2 === 0 ? 'bg-white' : 'bg-blue-50'">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="text-sm font-medium text-gray-900">
                  {{ record.location }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-medium">{{ record.temperature }}°C</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img 
                  v-if="record.icon"
                  :src="`https://openweathermap.org/img/wn/${record.icon}.png`" 
                  :alt="record.description"
                  class="w-8 h-8 mr-2"
                />
                <span class="text-sm text-gray-900 capitalize">{{ record.description }}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(record.date) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="lg:hidden mt-4 space-y-4" v-if="history.length">
      <div 
        v-for="record in paginatedHistory" 
        :key="record.id"
        class="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
      >
        <div class="flex justify-between items-start mb-2">
          <div class="font-medium text-lg">{{ record.location }}</div>
          <div class="text-sm text-gray-500">{{ formatDate(record.date) }}</div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img 
              v-if="record.icon"
              :src="`https://openweathermap.org/img/wn/${record.icon}.png`" 
              :alt="record.description"
              class="w-10 h-10"
            />
            <span class="text-gray-700 capitalize">{{ record.description }}</span>
          </div>
          <div class="text-xl font-bold text-blue-600">{{ record.temperature }}°C</div>
        </div>
      </div>
    </div>
    <div v-else-if="searchPerformed" class="text-center py-8">
      <i class="fas fa-face-frown text-gray-400 text-5xl mb-4"></i>
      <p class="text-gray-500 text-lg">No weather history found for the selected criteria</p>
      <p class="text-gray-400 text-sm mt-2">Try changing your filters or selecting a different date range</p>
    </div>
    
    <div v-else class="text-center py-8">
      <i class="fas fa-calendar text-blue-300 text-5xl mb-4"></i>
      <p class="text-gray-500">Select date range and location to view weather history</p>
    </div>
    
    <div v-if="totalPages > 1" class="mt-6 flex justify-center">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <a 
          href="#" 
          @click.prevent="changePage(currentPage - 1)" 
          :class="[
            'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
          ]"
          :aria-disabled="currentPage === 1"
        >
          <span class="sr-only">Previous</span>
          <i class="fas fa-chevron-left"></i>
        </a>
        
        <template v-for="page in displayedPages" :key="page">
          <a 
            v-if="page !== '...'"
            href="#" 
            @click.prevent="changePage(page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              currentPage === page 
                ? 'bg-blue-50 border-blue-500 text-blue-600' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            {{ page }}
          </a>
          <span 
            v-else
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
          >
            ...
          </span>
        </template>
        
        <a 
          href="#" 
          @click.prevent="changePage(currentPage + 1)"
          :class="[
            'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
          ]"
          :aria-disabled="currentPage === totalPages"
        >
          <span class="sr-only">Next</span>
          <i class="fas fa-chevron-right"></i>
        </a>
      </nav>
    </div>
  </div>
</template>

<script>
import { request } from 'graphql-request';

export default {
  data() {
    return {
      filters: { location: '', from: '', to: '' },
      cities: ['Delhi', 'Moscow', 'Paris', 'New York', 'Sydney', 'Riyadh'],
      history: [],
      error: null,
      loading: false,
      searchPerformed: false,
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },
    maxFromDate() {
      return this.filters.to || this.today;
    },
    dateRangeError() {
      if (!this.filters.from || !this.filters.to) return null;
      
      const fromDate = new Date(this.filters.from);
      const toDate = new Date(this.filters.to);
      
      if (fromDate > toDate) {
        return "From date cannot be after To date";
      }
      
      const diffTime = Math.abs(toDate - fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 30) {
        return "Date range cannot exceed 30 days";
      }
      
      return null;
    },
    totalPages() {
      return Math.ceil(this.history.length / this.itemsPerPage);
    },
    paginatedHistory() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.history.slice(start, end);
    },
    displayedPages() {
     
      const displayed = [];
      const totalPages = this.totalPages;
      const current = this.currentPage;
      
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          displayed.push(i);
        }
      } else {
        displayed.push(1);
        if (current > 3) {
          displayed.push('...');
        }
        const rangeStart = Math.max(2, current - 1);
        const rangeEnd = Math.min(totalPages - 1, current + 1);
        
        for (let i = rangeStart; i <= rangeEnd; i++) {
          displayed.push(i);
        }
        if (current < totalPages - 2) {
          displayed.push('...');
        }
        
        displayed.push(totalPages);
      }
      
      return displayed;
    }
  },
  methods: {
    async fetchHistory() {
      this.loading = true;
      this.error = null;
      this.history = [];
      
      try {
        const query = `
          query ($location: String, $from: String, $to: String) {
            getWeatherHistory(location: $location, from: $from, to: $to) {
              id
              location
              temperature
              description
              icon
              date
            }
          }
        `;
        
        const variables = {
          location: this.filters.location || undefined,
          from: this.filters.from || undefined,
          to: this.filters.to || undefined,
        };
        
        const response = await request('http://localhost:4000/graphql', query, variables);
        this.history = response.getWeatherHistory;
        this.searchPerformed = true;
        this.currentPage = 1; 
      } catch (err) {
        this.error = err.response?.errors?.[0]?.message || 'Failed to fetch weather history';
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) {
        return;
      }
      this.currentPage = page;
      this.$el.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
</script>
