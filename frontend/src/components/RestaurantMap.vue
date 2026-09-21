<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue';
import L from 'leaflet';
import type { Restaurant } from '../types';

const props = defineProps<{
  restaurants: Restaurant[];
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
let map: L.Map | null = null;
let markers: L.Marker[] = [];

function clearMarkers() {
  markers.forEach(marker => marker.remove());
  markers = [];
}

function renderMarkers() {
  if (!map) return;
  clearMarkers();

  props.restaurants.forEach(restaurant => {
    const marker = L.marker([restaurant.latitude, restaurant.longitude])
      .addTo(map!)
      .bindPopup(`
        <strong>${restaurant.name}</strong><br/>
        ${restaurant.address}<br/>
        <em>${restaurant.cuisine_type}</em>
      `);
    markers.push(marker);
  });

  if (props.restaurants.length > 0) {
    const bounds = L.latLngBounds(props.restaurants.map(r => [r.latitude, r.longitude]));
    map.fitBounds(bounds, { padding: [30, 30] });
  }
}

onMounted(() => {
  if (!mapContainer.value) return;

  // Centré par défaut sur Paris, comme les données d'exemple du sujet
  map = L.map(mapContainer.value).setView([48.8566, 2.3522], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  renderMarkers();
});

onUnmounted(() => {
  map?.remove();
});

watch(() => props.restaurants, () => {
  renderMarkers();
}, { deep: true });
</script>

<template>
  <div class="map-wrapper">
    <h2>Carte des restaurants</h2>
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<style scoped>
.map-wrapper {
  margin-bottom: 1rem;
}
.map {
  height: 400px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ddd;
}
</style>