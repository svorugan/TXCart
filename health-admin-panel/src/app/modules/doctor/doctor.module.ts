import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
// + any others like buttons/forms/dialogs
import { DoctorListComponent } from './pages/doctor-list/doctor-list.component';
import { DoctorFormComponent } from './pages/doctor-form/doctor-form.component';

const routes: Routes = [
  { path: 'list', component: DoctorListComponent },
  { path: 'create', component: DoctorFormComponent },
  { path: 'edit/:id', component: DoctorFormComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    HttpClientModule,
    DoctorListComponent,
    DoctorFormComponent
  ]
})
export class DoctorModule { }
