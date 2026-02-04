import { Component, inject, signal, OnInit } from '@angular/core';
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
export class DetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  // inject(): inyeccion sin constructor, util en componentes standalone
  // permite obtener dependencias de forma mas declarativa
  housingService = inject(HousingService);
  // inject(): obtener servicio singleton sin usar constructor
  weatherService = inject(WeatherService);

  // signal(): estado reactivo local que se lee llamando la funcion (housingLocation())
  // se usa para actualizar la vista de forma explicita y evitar dependencias de NgZone
  housingLocation = signal<HousingLocation | undefined>(undefined);
  // signal(): contenedor reactivo para datos del clima, se actualiza con .set()
  weatherData = signal<any>(null);

  applyForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  // FormGroup y FormControl: formularios reactivos que permiten validacion y control fino
  // Validators: reglas de validacion declarativas aplicadas en el modelo del formulario

  ngOnInit() {
    // ngOnInit: inicializacion que necesita acceder a ActivatedRoute y servicios
    // se ejecuta una vez creado el componente
    // snapshot.params: acceso sincrono a parametros de ruta (id) cuando no se necesita reaccionar a cambios
    const housingLocationId = Number(this.route.snapshot.params['id']);

    this.housingService.getHousingLocationById(housingLocationId).then(location => {
      // .set(): actualiza el Signal para notificar a la vista del nuevo valor
      this.housingLocation.set(location);

      if (location && this.weatherService.apiKey !== 'TU_API_KEY_AQUI') {
        this.weatherService.getWeather(
          location.coordinates.latitude,
          location.coordinates.longitude
        ).then(weather => {
            // .set(): actualiza signal con los datos recibidos del servicio de clima
            this.weatherData.set(weather);
        });
      }
    });

    const savedData = this.housingService.getSavedApplication();
    if (savedData) {
      // patchValue: actualiza solo los campos especificados sin resetear todo el FormGroup
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
      alert('Solicitud enviada correctamente. Los datos se han guardado.');
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
      return 'Email invalido';
    }
    return '';
  }
}