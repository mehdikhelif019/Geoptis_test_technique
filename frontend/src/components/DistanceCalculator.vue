<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Restaurant } from '../types';
import { haversineDistance, formatDistance } from '../utils/geo';

const props = defineProps<{
  restaurants: Restaurant[];
}>();

const restaurantAId = ref<number | null>(null);
const restaurantBId = ref<number | null>(null);

const distance = computed(() => {
  if (restaurantAId.value === null || restaurantBId.value === null) return null;
  if (restaurantAId.value === restaurantBId.value) return null;

  const a = props.restaurants.find(r => r.id === restaurantAId.value);
  const b = props.restaurants.find(r => r.id === restaurantBId.value);
  if (!a || !b) return null;

  return haversineDistance(a.latitude, a.longitude, b.latitude, b.longitude);
});
</script>

<template>
  <div class="distance-calculator">
    <h2>Calculer une distance</h2>
    <div class="controls">
      <select v-model.number="restaurantAId">
        <option :value="null" disabled>Choisir un restaurant</option>
        <option v-for="r in restaurants" :key="r.id" :value="r.id">{{ r.name }}</option>
      </select>

      <span class="arrow">↔</span>

      <select v-model.number="restaurantBId">
        <option :value="null" disabled>Choisir un restaurant</option>
        <option v-for="r in restaurants" :key="r.id" :value="r.id">{{ r.name }}</option>
      </select>
    </div>

    <p v-if="restaurantAId !== null && restaurantAId === restaurantBId" class="hint">
      Sélectionnez deux restaurants différents.
    </p>
    <p v-else-if="distance !== null" class="result">
      Distance : <strong>{{ formatDistance(distance) }}</strong>
    </p>
  </div>
</template>

<style scoped>
.distance-calculator {
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}
select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.arrow {
  font-size: 1.2rem;
  color: #666;
}
.result {
  margin-top: 1rem;
  font-size: 1.1rem;
}
.hint {
  margin-top: 1rem;
  color: #d32f2f;
  font-size: 0.9rem;
}
</style>