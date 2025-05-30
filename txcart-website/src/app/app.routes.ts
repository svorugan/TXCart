import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PatientJourneyComponent } from './patient-journey/patient-journey.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'patient-journey', component: PatientJourneyComponent },
  { path: '**', redirectTo: 'home' }
];
