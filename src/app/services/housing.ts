import { Injectable } from '@angular/core';
import { HousingLocation } from '../models/housing-location';

// providedIn: 'root' hace el servicio singleton disponible en toda la app sin importarlo
@Injectable({
  providedIn: 'root'
})
export class HousingService {
  url = 'http://localhost:3000/locations';

  constructor() { }

  // async/await: notacion moderna de promesas para codigo asincronico mas legible
  async getAllHousingLocations(): Promise<HousingLocation[]> {
    const data = await fetch(this.url);
    return await data.json() ?? [];
  }

  // async/await: esperar respuesta de fetch sin bloquear codigo, manejo de datos asincronos
  async getHousingLocationById(id: number): Promise<HousingLocation | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return await data.json() ?? undefined;
  }

  submitApplication(firstName: string, lastName: string, phone:string, email: string, date: string, text:string, check:string,) {
    const application = {
      firstName,
      lastName,
      phone,
      email,
      date: new Date().toISOString(),
      text,
      check
    };

    // localStorage: guardar datos en navegador para persistencia entre sesiones
    localStorage.setItem('housingApplication', JSON.stringify(application));
  }

  // localStorage: recuperar datos guardados localmente en el navegador
  getSavedApplication() {
    const saved = localStorage.getItem('housingApplication');
    return saved ? JSON.parse(saved) : null;
  }
}