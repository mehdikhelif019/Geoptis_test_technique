<script setup lang="ts">
import { onMounted, ref } from 'vue';
import RestaurantForm from './components/RestaurantForm.vue';
import RestaurantList from './components/RestaurantList.vue';
import RestaurantMap from './components/RestaurantMap.vue';
import DistanceCalculator from './components/DistanceCalculator.vue';
import { useRestaurants } from './composables/useRestaurants';
import type { Restaurant, RestaurantInput } from './types';

const { restaurants, loading, error, loadAll, search, filterByCuisine, addRestaurant, editRestaurant } = useRestaurants();

const restaurantToEdit = ref<Restaurant | null>(null);

onMounted(() => {
  loadAll();
});

async function handleSubmit(data: RestaurantInput) {
  try {
    await addRestaurant(data);
  } catch (e) {
    // erreur déjà affichée via `error`
  }
}

async function handleUpdate(id: number, data: RestaurantInput) {
  try {
    await editRestaurant(id, data);
    restaurantToEdit.value = null;
  } catch (e) {
    // erreur déjà affichée via `error`
  }
}

function handleEdit(restaurant: Restaurant) {
  restaurantToEdit.value = restaurant;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleCancelEdit() {
  restaurantToEdit.value = null;
}

function handleSearch(query: string) {
  search(query);
}

function handleFilterCuisine(cuisine: string) {
  filterByCuisine(cuisine);
}
</script>

<template>
  <div class="app">
    <header>
      <h1>Gestion des Emplacements de Restaurants</h1>
      <p class="subtitle">Geoptis - Test technique</p>
    </header>

    <main>
      <RestaurantForm
        :restaurant-to-edit="restaurantToEdit"
        @submit="handleSubmit"
        @update="handleUpdate"
        @cancel-edit="handleCancelEdit"
      />
      <RestaurantMap :restaurants="restaurants" />
      <DistanceCalculator :restaurants="restaurants" />
      <RestaurantList
        :restaurants="restaurants"
        :loading="loading"
        :error="error"
        @search="handleSearch"
        @filter-cuisine="handleFilterCuisine"
        @edit="handleEdit"
      />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}
header {
  margin-bottom: 2rem;
}
h1 {
  margin: 0;
  font-size: 1.8rem;
}
.subtitle {
  color: #666;
  margin-top: 0.3rem;
}
main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>