<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { CUISINE_TYPES } from '../types';
import type { Restaurant, RestaurantInput } from '../types';

const props = defineProps<{
  restaurantToEdit: Restaurant | null;
}>();

const emit = defineEmits<{
  submit: [data: RestaurantInput];
  update: [id: number, data: RestaurantInput];
  cancelEdit: [];
}>();

const form = reactive({
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  cuisine_type: '',
  phone_number: ''
});

const errors = reactive<Record<string, string>>({});
const submitting = ref(false);

watch(() => props.restaurantToEdit, (restaurant) => {
  if (restaurant) {
    form.name = restaurant.name;
    form.address = restaurant.address;
    form.latitude = String(restaurant.latitude);
    form.longitude = String(restaurant.longitude);
    form.cuisine_type = restaurant.cuisine_type;
    form.phone_number = restaurant.phone_number || '';
  }
}, { immediate: true });

function resetForm() {
  form.name = '';
  form.address = '';
  form.latitude = '';
  form.longitude = '';
  form.cuisine_type = '';
  form.phone_number = '';
}

function validate(): boolean {
  Object.keys(errors).forEach(key => delete errors[key]);

  if (form.name.trim().length < 3) {
    errors.name = 'Le nom doit contenir au moins 3 caractères';
  }

  if (form.address.trim().length < 10) {
    errors.address = 'L\'adresse doit contenir au moins 10 caractères';
  }

  const lat = Number(form.latitude);
  if (form.latitude === '' || isNaN(lat) || lat < -90 || lat > 90) {
    errors.latitude = 'La latitude doit être comprise entre -90 et 90';
  }

  const lng = Number(form.longitude);
  if (form.longitude === '' || isNaN(lng) || lng < -180 || lng > 180) {
    errors.longitude = 'La longitude doit être comprise entre -180 et 180';
  }

  if (!form.cuisine_type) {
    errors.cuisine_type = 'Veuillez choisir un type de cuisine';
  }

  if (form.phone_number && !/^[\d\s+()-]{6,20}$/.test(form.phone_number)) {
    errors.phone_number = 'Format de téléphone invalide';
  }

  return Object.keys(errors).length === 0;
}

async function handleSubmit() {
  if (!validate()) return;

  submitting.value = true;
  const data: RestaurantInput = {
    name: form.name.trim(),
    address: form.address.trim(),
    latitude: Number(form.latitude),
    longitude: Number(form.longitude),
    cuisine_type: form.cuisine_type,
    phone_number: form.phone_number.trim()
  };

  try {
    if (props.restaurantToEdit) {
      emit('update', props.restaurantToEdit.id, data);
    } else {
      emit('submit', data);
    }
    resetForm();
  } finally {
    submitting.value = false;
  }
}

function handleCancel() {
  resetForm();
  emit('cancelEdit');
}
</script>

<template>
  <form class="restaurant-form" @submit.prevent="handleSubmit">
    <h2>{{ restaurantToEdit ? 'Modifier le restaurant' : 'Ajouter un restaurant' }}</h2>

    <div class="field">
      <label for="name">Nom du restaurant *</label>
      <input id="name" v-model="form.name" type="text" placeholder="Ex: Le Comptoir du Relais" />
      <span v-if="errors.name" class="error">{{ errors.name }}</span>
    </div>

    <div class="field">
      <label for="address">Adresse *</label>
      <input id="address" v-model="form.address" type="text" placeholder="Ex: 9 Carrefour de l'Odéon, 75006 Paris" />
      <span v-if="errors.address" class="error">{{ errors.address }}</span>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="latitude">Latitude *</label>
        <input id="latitude" v-model="form.latitude" type="text" placeholder="Ex: 48.8529" />
        <span v-if="errors.latitude" class="error">{{ errors.latitude }}</span>
      </div>

      <div class="field">
        <label for="longitude">Longitude *</label>
        <input id="longitude" v-model="form.longitude" type="text" placeholder="Ex: 2.3387" />
        <span v-if="errors.longitude" class="error">{{ errors.longitude }}</span>
      </div>
    </div>

    <div class="field">
      <label for="cuisine">Type de cuisine *</label>
      <select id="cuisine" v-model="form.cuisine_type">
        <option value="" disabled>Choisir un type</option>
        <option v-for="type in CUISINE_TYPES" :key="type" :value="type">{{ type }}</option>
      </select>
      <span v-if="errors.cuisine_type" class="error">{{ errors.cuisine_type }}</span>
    </div>

    <div class="field">
      <label for="phone">Numéro de téléphone</label>
      <input id="phone" v-model="form.phone_number" type="text" placeholder="Ex: +33 1 44 27 07 97" />
      <span v-if="errors.phone_number" class="error">{{ errors.phone_number }}</span>
    </div>

    <div class="actions">
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Enregistrement...' : (restaurantToEdit ? 'Enregistrer les modifications' : 'Ajouter le restaurant') }}
      </button>
      <button v-if="restaurantToEdit" type="button" class="cancel" @click="handleCancel">
        Annuler
      </button>
    </div>
  </form>
</template>

<style scoped>
.restaurant-form {
  max-width: 500px;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 2rem;
}
.field {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.field-row {
  display: flex;
  gap: 1rem;
}
.field-row .field {
  flex: 1;
}
label {
  font-weight: 600;
  margin-bottom: 0.3rem;
}
input, select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.error {
  color: #d32f2f;
  font-size: 0.85rem;
  margin-top: 0.2rem;
}
button {
  padding: 0.6rem 1.2rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
button:disabled {
  background: #999;
  cursor: not-allowed;
}
.actions {
  display: flex;
  gap: 0.6rem;
}
.cancel {
  background: #999;
}
</style>