export interface Restaurant {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine_type: string;
  phone_number: string | null;
  created_at: string;
}

export interface RestaurantInput {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine_type: string;
  phone_number?: string;
}

export const VALID_CUISINE_TYPES = [
  'Française',
  'Italienne',
  'Asiatique',
  'Américaine',
  'Méditerranéenne',
  'Autre'
] as const;