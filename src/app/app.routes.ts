import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { DetailsComponent } from './details/details';
import { HousingLocationFormComponent } from './housing-location-form/housing-location-form';
import { DetailsFormComponent } from './details-form/details-form';


// Routes: configuracion de rutas para componentes standalone, reemplaza NgModule routing
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'Details Page'
  },
  {
    path: 'new',
    component: HousingLocationFormComponent,
    title: 'Add New Housing'
  },
  {
    path: 'form',
    component: DetailsFormComponent,
    title:'form'
  }
];