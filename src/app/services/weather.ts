import { Injectable } from '@angular/core';

// providedIn: 'root' hace el servicio singleton disponible en toda la app sin importarlo
@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey = '7231992b5a8a4eedb2253249260302';
  baseUrl = 'https://api.weatherapi.com/v1/current.json';

  constructor() { }

  // async/await: esperar respuesta de API de clima de forma no bloqueante
  async getWeather(lat: number, lon: number): Promise<any> {
    try {
      const url = `${this.baseUrl}?key=${this.apiKey}&q=${lat},${lon}`;
      const response = await fetch(url);

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      return null;
    }
  }
}