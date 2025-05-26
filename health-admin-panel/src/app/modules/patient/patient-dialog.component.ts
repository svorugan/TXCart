import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Patient } from './patient-management.service';

@Component({
  selector: 'app-patient-dialog',
  templateUrl: './patient-dialog.component.html',
  styleUrls: ['./patient-dialog.component.scss']
})
export class PatientDialogComponent implements OnInit {
  patientForm: FormGroup;
  dialogTitle: string;
  isEdit: boolean;
  viewOnly: boolean;
  
  // Predefined options
  genders: string[] = ['Male', 'Female', 'Other'];
  bloodGroups: string[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  surgeryTypes: string[] = [
    'Total Knee Replacement', 
    'Partial Knee Replacement', 
    'Total Hip Replacement',
    'Partial Hip Replacement',
    'Knee Arthroscopy',
    'Hip Arthroscopy',
    'Shoulder Replacement',
    'Spinal Fusion',
    'Disc Replacement'
  ];
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { patient: Patient | null, isEdit: boolean, viewOnly?: boolean }
  ) {
    this.isEdit = data.isEdit;
    this.viewOnly = data.viewOnly || false;
    this.dialogTitle = this.isEdit ? 'Edit Patient' : 'Add New Patient';
    
    if (this.viewOnly) {
      this.dialogTitle = 'Patient Details';
    }
    
    this.patientForm = this.fb.group({
      id: [data.patient?.id || this.generateId()],
      name: [data.patient?.name || '', Validators.required],
      age: [data.patient?.age || '', [Validators.required, Validators.min(0), Validators.max(120)]],
      gender: [data.patient?.gender || '', Validators.required],
      contact: [data.patient?.contact || '', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: [data.patient?.email || '', [Validators.required, Validators.email]],
      address: [data.patient?.address || '', Validators.required],
      medicalHistory: [data.patient?.medicalHistory || '', Validators.required],
      surgeryType: [data.patient?.surgeryType || ''],
      surgeryDate: [data.patient?.surgeryDate ? new Date(data.patient.surgeryDate) : null],
      surgeon: [data.patient?.surgeon || ''],
      hospital: [data.patient?.hospital || ''],
      implant: [data.patient?.implant || ''],
      bloodGroup: [data.patient?.bloodGroup || ''],
      emergencyContact: [data.patient?.emergencyContact || ''],
      insuranceProvider: [data.patient?.insuranceProvider || ''],
      insuranceNumber: [data.patient?.insuranceNumber || ''],
      allergies: [data.patient?.allergies || ''],
      medications: [data.patient?.medications || ''],
      lastVisitDate: [data.patient?.lastVisitDate ? new Date(data.patient.lastVisitDate) : null],
      nextAppointment: [data.patient?.nextAppointment ? new Date(data.patient.nextAppointment) : null]
    });
    
    if (this.viewOnly) {
      this.patientForm.disable();
    }
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.patientForm.valid) {
      const formValue = this.patientForm.value;
      
      // Convert Date objects to strings
      if (formValue.surgeryDate) {
        formValue.surgeryDate = this.formatDate(formValue.surgeryDate);
      }
      
      if (formValue.lastVisitDate) {
        formValue.lastVisitDate = this.formatDate(formValue.lastVisitDate);
      }
      
      if (formValue.nextAppointment) {
        formValue.nextAppointment = this.formatDate(formValue.nextAppointment);
      }
      
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  
  private generateId(): number {
    // Generate a simple ID based on timestamp
    return Math.floor(Math.random() * 10000);
  }
  
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
