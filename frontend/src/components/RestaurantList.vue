<script setup lang="ts">
import { ref, watch } from 'vue';
import { CUISINE_TYPES } from '../types';
import type { Restaurant } from '../types';

defineProps<{
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  search: [query: string];
  filterCuisine: [cuisine: string];
  edit: [restaurant: Restaurant];
}>();

const searchQuery = ref('');
const selectedCuisine = ref('');

let debounceTimer: ReturnType<typeof setTimeout>;
watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search', newValue);
  }, 400);
});

function handleCuisineChange() {
  emit('filterCuisine', selectedCuisine.value);
}

function formatCoordinate(value: number): string {
  return value.toFixed(4);
}

const cuisineColors: Record<string, string> = {
  'Française': '#1976d2',
  'Italienne': '#388e3c',
  'Asiatique': '#f57c00',
  'Américaine': '#c62828',
  'Méditerranéenne': '#0097a7',
  'Autre': '#616161'
};
</script>

<template>
  <div class="restaurant-list">
    <h2>Restaurants</h2>

    <div class="controls">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Rechercher par nom ou adresse..."
        class="search-input"
      />
      <select v-model="selectedCuisine" @change="handleCuisineChange">
        <option value="">Toutes les cuisines</option>
        <option v-for="type in CUISINE_TYPES" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

    <p v-if="loading" class="status">Chargement...</p>
    <p v-else-if="error" class="status error">{{ error }}</p>
    <p v-else-if="restaurants.length === 0" class="status">Aucun restaurant trouvé.</p>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Adresse</th>
          <th>Coordonnées</th>
          <th>Cuisine</th>
          <th>Téléphone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="restaurant in restaurants" :key="restaurant.id">
          <td>{{ restaurant.name }}</td>
          <td>{{ restaurant.address }}</td>
          <td class="coords" :title="`${restaurant.latitude}, ${restaurant.longitude}`">
            {{ formatCoordinate(restaurant.latitude) }}, {{ formatCoordinate(restaurant.longitude) }}
          </td>
          <td>
            <span
              class="cuisine-badge"
              :style="{ backgroundColor: cuisineColors[restaurant.cuisine_type] || '#616161' }"
            >
              {{ restaurant.cuisine_type }}
            </span>
          </td>
          <td>{{ restaurant.phone_number || '—' }}</td>
          <td>
            <button class="edit-btn" @click="emit('edit', restaurant)">Modifier</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.restaurant-list {
  max-width: 900px;
}
.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.status {
  color: #666;
  font-style: italic;
}
.status.error {
  color: #d32f2f;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  text-align: left;
  padding: 0.6rem;
  border-bottom: 1px solid #eee;
}
.coords {
  font-family: monospace;
  font-size: 0.9rem;
}
.cuisine-badge {
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
}
.edit-btn {
  padding: 0.3rem 0.8rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}
</style>