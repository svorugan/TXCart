import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';

import { HomeComponent } from './dashboard/home.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'home', component: HomeComponent },
      {
        path: 'patient-journey',
        loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule)
      },
      {
        path: 'doctors',
        loadChildren: () => import('./modules/doctor/doctor.module').then(m => m.DoctorModule)
      },
      {
        path: 'hospitals',
        loadChildren: () => import('./modules/hospital/hospital.module').then(m => m.HospitalModule)
      },
      {
        path: 'implants',
        loadChildren: () => import('./modules/implant/implant.module').then(m => m.ImplantModule)
      },
      {
        path: 'diagnostics',
        loadChildren: () => import('./modules/diagnostic/diagnostic.module').then(m => m.DiagnosticModule)
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
