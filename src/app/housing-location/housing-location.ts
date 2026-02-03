import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HousingLocation } from '../models/housing-location';

// Componente standalone: se define de forma independiente sin NgModule
@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css'
})
export class HousingLocationComponent {
  // @Input(): recibe datos del componente padre, necesario para pasar housingLocation
  @Input() housingLocation!: HousingLocation;
}