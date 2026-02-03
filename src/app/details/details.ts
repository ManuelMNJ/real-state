import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HousingService } from '../services/housing';
import { WeatherService } from '../services/weather';
import { HousingLocation } from '../models/housing-location';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  weatherService = inject(WeatherService);
  cdr = inject(ChangeDetectorRef); // ← NUEVO: para actualizar la pantalla

  housingLocation: HousingLocation | undefined;
  weatherData: any = null;

  applyForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor() {
    const housingLocationId = Number(this.route.snapshot.params['id']);

    this.housingService.getHousingLocationById(housingLocationId).then(housingLocation => {
      this.housingLocation = housingLocation;
      this.cdr.detectChanges(); // ← NUEVO: le dice a Angular que actualice la pantalla

      // Obtener clima
      if (housingLocation && this.weatherService.apiKey !== 'TU_API_KEY_AQUI') {
        this.weatherService.getWeather(
          housingLocation.coordinates.latitude,
          housingLocation.coordinates.longitude
        ).then(weather => {
          this.weatherData = weather;
          this.cdr.detectChanges(); // ← NUEVO: actualizar también cuando llegue el clima
        });
      }
    });

    // Cargar datos guardados del LocalStorage
    const savedData = this.housingService.getSavedApplication();
    if (savedData) {
      this.applyForm.patchValue({
        firstName: savedData.firstName,
        lastName: savedData.lastName,
        email: savedData.email
      });
    }
  }

  submitApplication() {
    if (this.applyForm.valid) {
      this.housingService.submitApplication(
        this.applyForm.value.firstName ?? '',
        this.applyForm.value.lastName ?? '',
        this.applyForm.value.email ?? ''
      );
      alert('¡Solicitud enviada correctamente! Los datos se han guardado.');
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.applyForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.applyForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    return '';
  }
}