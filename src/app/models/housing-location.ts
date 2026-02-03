export interface HousingLocation {
  id: number;
  name: string;
  city: string;
  state: string;
  photo: string;
  availableUnits: number;
  wifi: boolean;
  laundry: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  price: number;
  available: boolean;
}