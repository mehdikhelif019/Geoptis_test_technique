import { ref } from 'vue';
import type { Restaurant, RestaurantInput } from '../types';
import { fetchRestaurants, searchRestaurants, filterRestaurantsByCuisine, createRestaurant, updateRestaurant } from '../services/restaurantService';

export function useRestaurants() {
  const restaurants = ref<Restaurant[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function loadAll() {
    loading.value = true;
    error.value = null;
    try {
      restaurants.value = await fetchRestaurants();
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue';
    } finally {
      loading.value = false;
    }
  }

  async function search(query: string) {
    if (!query.trim()) {
      return loadAll();
    }
    loading.value = true;
    error.value = null;
    try {
      restaurants.value = await searchRestaurants(query);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur de recherche';
    } finally {
      loading.value = false;
    }
  }

  async function filterByCuisine(cuisine: string) {
    if (!cuisine) {
      return loadAll();
    }
    loading.value = true;
    error.value = null;
    try {
      restaurants.value = await filterRestaurantsByCuisine(cuisine);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur de filtrage';
    } finally {
      loading.value = false;
    }
  }

  async function addRestaurant(data: import('../types').RestaurantInput) {
    loading.value = true;
    error.value = null;
    try {
        const newRestaurant = await createRestaurant(data);
        restaurants.value = [newRestaurant, ...restaurants.value];
        return newRestaurant;
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Erreur lors de la création';
        throw e;
    } finally {
        loading.value = false;
    }
  }

  async function editRestaurant(id: number, data: RestaurantInput) {
    loading.value = true;
    error.value = null;
    try {
        const updated = await updateRestaurant(id, data);
        restaurants.value = restaurants.value.map(r => (r.id === id ? updated : r));
        return updated;
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Erreur lors de la modification';
        throw e;
    } finally {
        loading.value = false;
    }
  }

  return { restaurants, loading, error, loadAll, search, filterByCuisine, addRestaurant, editRestaurant };
}