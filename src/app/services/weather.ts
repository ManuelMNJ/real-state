import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey = '7231992b5a8a4eedb2253249260302';
  baseUrl = 'https://api.weatherapi.com/v1/current.json';

  constructor() { }

  async getWeather(lat: number, lon: number): Promise<any> {
    try {
      const url = `${this.baseUrl}?key=${this.apiKey}&q=${lat},${lon}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('Error al obtener clima');
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
}