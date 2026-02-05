import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location';
import { HousingLocation } from '../models/housing-location';
import { HousingService } from '../services/housing';
import { RouterModule } from '@angular/router';

// Componente standalone: se registra directamente sin necesidad de NgModule
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocationComponent, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  housingLocationList: HousingLocation[] = [];
  // inject(): inyeccion de dependencias sin constructor, requerido en standalone
  housingService: HousingService = inject(HousingService);
  filteredLocationList: HousingLocation[] = [];

  constructor() {
    this.housingService.getAllHousingLocations().then((housingLocationList: HousingLocation[]) => {
      this.housingLocationList = housingLocationList;
      this.filteredLocationList = housingLocationList;
      
    });
  }

  filterResults(text: string, checkbox: boolean, order: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }
    
       
  if(!checkbox.valueOf){
      this.filteredLocationList = this.housingLocationList;
      return;
    }
    
    if(order==="asc"){
      this.filteredLocationList =this.housingLocationList.sort()
    }
  
    this.filteredLocationList = this.housingLocationList.filter(
      housingLocation => housingLocation?.city.toLowerCase().includes(text.toLowerCase())
    );
 

    this.filteredLocationList = this.housingLocationList.filter(
      housingLocation => housingLocation?.available === true
    )



  }

 
  
}