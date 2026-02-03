import { Injectable } from '@angular/core';
import { HousingLocation } from '../models/housing-location';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  url = 'http://localhost:3000/locations';

  constructor() { }

  // Obtener todas las casas
  async getAllHousingLocations(): Promise<HousingLocation[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  // Obtener una casa por ID
  async getHousingLocationById(id: number): Promise<HousingLocation | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return await data.json() ?? undefined;
  }

  // Guardar solicitud en LocalStorage
  submitApplication(firstName: string, lastName: string, email: string) {
    const application = {
      firstName,
      lastName,
      email,
      date: new Date().toISOString()
    };
    
    localStorage.setItem('housingApplication', JSON.stringify(application));
    console.log('Solicitud guardada:', application);
  }

  // Obtener solicitud guardada
  getSavedApplication() {
    const saved = localStorage.getItem('housingApplication');
    return saved ? JSON.parse(saved) : null;
  }
}