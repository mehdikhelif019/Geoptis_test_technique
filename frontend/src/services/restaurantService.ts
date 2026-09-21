import type { Restaurant, RestaurantInput } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/restaurants';

function normalizeRestaurant(raw: any): Restaurant {
  return {
    ...raw,
    latitude: Number(raw.latitude),
    longitude: Number(raw.longitude)
  };
}

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error('Impossible de récupérer les restaurants');
  const data = await response.json();
  return data.map(normalizeRestaurant);
}

export async function searchRestaurants(query: string): Promise<Restaurant[]> {
  const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Erreur lors de la recherche');
  const data = await response.json();
  return data.map(normalizeRestaurant);
}

export async function filterRestaurantsByCuisine(cuisine: string): Promise<Restaurant[]> {
  const response = await fetch(`${API_BASE}/filter?cuisine=${encodeURIComponent(cuisine)}`);
  if (!response.ok) throw new Error('Erreur lors du filtrage');
  const data = await response.json();
  return data.map(normalizeRestaurant);
}

export async function createRestaurant(data: RestaurantInput): Promise<Restaurant> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Erreur lors de la création du restaurant');
  }

  const raw = await response.json();
  return normalizeRestaurant(raw);
}

export async function updateRestaurant(id: number, data: RestaurantInput): Promise<Restaurant> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || 'Erreur lors de la modification du restaurant');
  }

  const raw = await response.json();
  return normalizeRestaurant(raw);
}