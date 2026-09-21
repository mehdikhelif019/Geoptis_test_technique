import { RestaurantInput, VALID_CUISINE_TYPES } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRestaurant(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3) {
    errors.push({ field: 'name', message: 'Le nom doit contenir au moins 3 caractères' });
  }

  if (!data.address || typeof data.address !== 'string' || data.address.trim().length < 10) {
    errors.push({ field: 'address', message: 'L\'adresse doit contenir au moins 10 caractères' });
  }

  const lat = Number(data.latitude);
  if (data.latitude === undefined || isNaN(lat) || lat < -90 || lat > 90) {
    errors.push({ field: 'latitude', message: 'La latitude doit être un nombre décimal compris entre -90 et 90' });
  }

  const lng = Number(data.longitude);
  if (data.longitude === undefined || isNaN(lng) || lng < -180 || lng > 180) {
    errors.push({ field: 'longitude', message: 'La longitude doit être un nombre décimal compris entre -180 et 180' });
  }

  if (!data.cuisine_type || !VALID_CUISINE_TYPES.includes(data.cuisine_type)) {
    errors.push({ field: 'cuisine_type', message: `Le type de cuisine doit être l'un des suivants : ${VALID_CUISINE_TYPES.join(', ')}` });
  }

  if (data.phone_number && !/^[\d\s+()-]{6,20}$/.test(data.phone_number)) {
    errors.push({ field: 'phone_number', message: 'Le format du numéro de téléphone est invalide' });
  }

  return errors;
}