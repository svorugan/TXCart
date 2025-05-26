import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PatientManagementService, Patient } from './patient-management.service';
import { PatientDialogComponent } from './patient-dialog.component';

@Component({
  selector: 'app-patient-management',
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.scss']
})
export class PatientManagementComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchForm: FormGroup;
  
  displayedColumns: string[] = ['name', 'age', 'gender', 'contact', 'medicalHistory', 'surgeryType', 'surgeryDate', 'actions'];
  
  constructor(
    private fb: FormBuilder,
    private patientService: PatientManagementService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      gender: [''],
      surgeryType: [''],
      ageRange: [[0, 100]]
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    
    // Apply filters when form values change
    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe(patients => {
      this.patients = patients;
      this.filteredPatients = patients;
      
      // Apply initial filters
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const filterValues = this.searchForm.value;
    
    this.filteredPatients = this.patients.filter(patient => {
      // Filter by name
      const nameMatch = !filterValues.name || 
        patient.name.toLowerCase().includes(filterValues.name.toLowerCase());
      
      // Filter by gender
      const genderMatch = !filterValues.gender || 
        patient.gender === filterValues.gender;
      
      // Filter by surgery type
      const surgeryMatch = !filterValues.surgeryType || 
        (patient.surgeryType && patient.surgeryType.toLowerCase().includes(filterValues.surgeryType.toLowerCase()));
      
      // Filter by age range
      const ageMatch = !filterValues.ageRange || 
        (patient.age >= filterValues.ageRange[0] && 
         patient.age <= filterValues.ageRange[1]);
      
      return nameMatch && genderMatch && surgeryMatch && ageMatch;
    });
  }

  resetFilters(): void {
    this.searchForm.reset({
      name: '',
      gender: '',
      surgeryType: '',
      ageRange: [0, 100]
    });
    this.filteredPatients = this.patients;
  }

  addPatient(): void {
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      width: '800px',
      data: { patient: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patientService.addPatient(result).subscribe(newPatient => {
          this.patients = [...this.patients, newPatient];
          this.applyFilters();
          
          this.snackBar.open('Patient added successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        }, error => {
          console.error('Error adding patient:', error);
          this.snackBar.open('Error adding patient', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        });
      }
    });
  }

  editPatient(patient: Patient): void {
    const dialogRef = this.dialog.open(PatientDialogComponent, {
      width: '800px',
      data: { patient, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.patientService.updatePatient(patient.id, result).subscribe(updatedPatient => {
          // Update the patient in the lists
          this.patients = this.patients.map(item => 
            item.id === updatedPatient.id ? updatedPatient : item
          );
          
          this.applyFilters();
          
          this.snackBar.open('Patient updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        }, error => {
          console.error('Error updating patient:', error);
          this.snackBar.open('Error updating patient', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        });
      }
    });
  }

  viewPatientDetails(patient: Patient): void {
    this.dialog.open(PatientDialogComponent, {
      width: '800px',
      data: { patient, isEdit: false, viewOnly: true }
    });
  }
}
