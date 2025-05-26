import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { HospitalListComponent } from './hospital-list.component';
import { HospitalFormComponent } from './pages/hospital-form/hospital-form.component';

const routes: Routes = [
  { path: '', component: HospitalListComponent },
  { path: 'create', component: HospitalFormComponent },
  { path: 'edit/:id', component: HospitalFormComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    HospitalListComponent
  ]
})
export class HospitalModule { }
