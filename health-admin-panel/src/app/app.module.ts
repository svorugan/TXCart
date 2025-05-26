import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientViewComponent } from './modules/patient/patient-view.component';
import { DoctorManagementComponent } from './modules/doctor/doctor-management.component';
import { DoctorAddComponent } from './modules/doctor/doctor-add.component';
import { DoctorModule } from './modules/doctor/doctor.module';
import { HospitalManagementComponent } from './modules/hospital/hospital-management.component';
import { ImplantsModule } from './modules/implants/implants.module';
import { ImplantsManagementComponent } from './modules/implants/implants-management.component';
import { DiagnosticsModule } from './modules/diagnostics/diagnostics.module';
import { DiagnosticsManagementComponent } from './modules/diagnostics/diagnostics-management.component';

// Services
import { PatientService } from './modules/patient/patient.service';
import { DoctorService } from './modules/doctor/doctor.service';
import { HospitalService } from './modules/hospital/hospital.service';
import { DiagnosticsService } from './modules/diagnostics/diagnostics.service';
import { ImplantsService } from './modules/implants/implants.service';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patient-journey', component: PatientViewComponent },
  { path: 'hospitals', component: HospitalManagementComponent },
  { path: 'doctors/add', component: DoctorAddComponent },
  { path: 'doctors/edit/:id', component: DoctorAddComponent },
  { path: 'doctors', component: DoctorManagementComponent },
  { path: 'implants', component: ImplantsManagementComponent },
  { path: 'diagnostics', component: DiagnosticsManagementComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PatientViewComponent,
    HospitalManagementComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    DoctorModule,
    ImplantsModule,
    DiagnosticsModule,
    // HospitalModule,
    // Angular Material
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatStepperModule,
    MatSliderModule,
    MatTabsModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatChipsModule,
    MatBadgeModule,
    MatTableModule,
    MatSnackBarModule
  ],
  providers: [
    PatientService,
    DoctorService,
    HospitalService,
    DiagnosticsService,
    ImplantsService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
