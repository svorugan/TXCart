import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PATIENT_VIEW_ROUTES } from './patient-view.routes';
import { PatientViewComponent } from './patient-view.component';

@NgModule({
  imports: [
    RouterModule.forChild(PATIENT_VIEW_ROUTES),
    PatientViewComponent
  ]
})
export class PatientModule {}
