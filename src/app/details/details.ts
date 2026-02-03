import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HousingService } from '../services/housing';
import { WeatherService } from '../services/weather';
import { HousingLocation } from '../models/housing-location';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Componente standalone: no necesita NgModule, se registra directamente en rutas
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class DetailsComponent {
  // inject() inyecta dependencias sin necesidad de constructor, mejor para standalone
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  weatherService = inject(WeatherService);
  cdr = inject(ChangeDetectorRef);

  housingLocation: HousingLocation | undefined;
  weatherData: any = null;

  // FormGroup y FormControl: Reactive Forms para control robusto y reactive del formulario
  applyForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor() {
    // ActivatedRoute con snapshot.params: obtener ID de URL para cargar datos especificos
    const housingLocationId = Number(this.route.snapshot.params['id']);

    // async/await con fetch: cargar datos de API y actualizar vista manualmente
    this.housingService.getHousingLocationById(housingLocationId).then(housingLocation => {
      this.housingLocation = housingLocation;
      this.cdr.detectChanges();

      if (housingLocation && this.weatherService.apiKey !== 'TU_API_KEY_AQUI') {
        this.weatherService.getWeather(
          housingLocation.coordinates.latitude,
          housingLocation.coordinates.longitude
        ).then(weather => {
          this.weatherData = weather;
          this.cdr.detectChanges();
        });
      }
    });

    const savedData = this.housingService.getSavedApplication();
    if (savedData) {
      // patchValue: actualizar FormGroup parcialmente sin validar campos omitidos
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