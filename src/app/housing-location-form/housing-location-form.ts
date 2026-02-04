import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-housing-location-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './housing-location-form.html',
  styleUrl: './housing-location-form.css',
})
export class HousingLocationFormComponent {
  // NonNullableFormBuilder: evita controles con null, simplifica validacion sin checks extras
  private fb = inject(NonNullableFormBuilder);
  // HttpClient: cliente HTTP de Angular que devuelve Observables para GET/POST
  private http = inject(HttpClient);
  private router = inject(Router);

  // FormBuilder y Validators: crea un FormGroup con validadores declarativos
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    city: ['', Validators.required],
    state: ['', Validators.required],
    availableUnits: [1, [Validators.required, Validators.min(1)]],
    price: [10000, [Validators.required, Validators.min(10000)]],
    wifi: [false],
    laundry: [false],
    available: [true],
  });

  successMsg = '';
  errorMsg = '';
  submitting = false;

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    // Primero obtener todas las casas para calcular el siguiente ID
    // subscribe(): consumir el Observable devuelto por HttpClient y manejar la respuesta
    this.http.get<any[]>('http://localhost:3000/locations').subscribe({
      next: (houses) => {
        const maxId = houses.length > 0 ? Math.max(...houses.map((h) => h.id)) : -1;
        const nextId = maxId + 1;

        // getRawValue(): obtiene valores crudos del formulario, util antes de enviar datos
        const newHouse = {
          id: nextId, 
          ...this.form.getRawValue(),
          photo:
            'https://angular.io/assets/images/tutorials/faa/bernard-hermant-CLKGGwIBTaY-unsplash.jpg',
          coordinates: { latitude: 0, longitude: 0 },
        };

        // POST: crear nueva vivienda en el backend
        this.http.post('http://localhost:3000/locations', newHouse).subscribe({
          // subscribe(): manejar resultado del POST (exitoso o error)
          next: (created: any) => {
            this.successMsg = `Vivienda "${created.name}" creada con exito (ID: ${created.id})`;
            this.form.reset({
              availableUnits: 1,
              price: 10000,
              wifi: false,
              laundry: false,
              available: true,
            });
            this.submitting = false;
            // setTimeout: retraso para mostrar mensaje antes de navegar; es asincrono
            setTimeout(() => this.router.navigate(['/']), 3000);
          },
          error: () => {
            this.errorMsg = 'Error al guardar. Verifica que json-server este corriendo.';
            this.submitting = false;
          },
        });
      },
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
