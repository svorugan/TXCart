import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService, Doctor } from '../../doctor.service';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.scss'
})
export class DoctorListComponent implements OnInit {
  editingDoctorId: number|null = null;
  editDoctor: Doctor|null = null;
  doctorList: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  displayedColumns = ['id', 'name', 'specialty', 'yearsExperience', 'city', 'state', 'patientRating', 'actions'];

  // Search fields
  searchName = '';
  searchYearsExperience: number|null = null;
  searchCity = '';
  searchState = '';
  searchSpecialty = '';
  searchPatientRating: number|null = null;

  // Dropdown options
  specialties: string[] = [
    'Orthopedics',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'General Surgery',
    'ENT',
    'Dermatology',
    'Ophthalmology',
    'Gynecology',
    'Urology'
  ];
  states: string[] = [
    'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Maharashtra',
    'Delhi', 'West Bengal', 'Gujarat', 'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh',
    'Bihar', 'Odisha', 'Assam', 'Chhattisgarh', 'Haryana', 'Jharkhand', 'Goa', 'Himachal Pradesh'
  ];

  // Filter methods
  hasActiveFilters(): boolean {
    return !!this.searchName || 
           this.searchYearsExperience !== null || 
           !!this.searchCity || 
           !!this.searchState || 
           !!this.searchSpecialty || 
           this.searchPatientRating !== null;
  }
  
  clearFilter(filterName: string): void {
    switch(filterName) {
      case 'name':
        this.searchName = '';
        break;
      case 'yearsExperience':
        this.searchYearsExperience = null;
        break;
      case 'city':
        this.searchCity = '';
        break;
      case 'state':
        this.searchState = '';
        break;
      case 'specialty':
        this.searchSpecialty = '';
        break;
      case 'patientRating':
        this.searchPatientRating = null;
        break;
    }
    this.applyFilters();
  }
  
  clearAllFilters(): void {
    this.searchName = '';
    this.searchYearsExperience = null;
    this.searchCity = '';
    this.searchState = '';
    this.searchSpecialty = '';
    this.searchPatientRating = null;
    this.applyFilters();
  }

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe(data => {
      this.doctorList = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredDoctors = this.doctorList.filter(doc => {
      return (!this.searchName || doc.name.toLowerCase().includes(this.searchName.toLowerCase())) &&
        (this.searchYearsExperience === null || doc.yearsExperience === this.searchYearsExperience) &&
        (!this.searchCity || (doc.city && doc.city.toLowerCase().includes(this.searchCity.toLowerCase()))) &&
        (!this.searchState || (doc.state && doc.state === this.searchState)) &&
        (!this.searchSpecialty || (doc.specialty && doc.specialty === this.searchSpecialty)) &&
        (this.searchPatientRating === null || doc.patientRating === this.searchPatientRating);
    });
  }



  startEdit(doctor: Doctor) {
    this.editingDoctorId = doctor.id;
    this.editDoctor = { ...doctor };
  }

  cancelEdit() {
    this.editingDoctorId = null;
    this.editDoctor = null;
  }

  saveEdit() {
    if (!this.editDoctor) return;
    this.doctorService.updateDoctor(this.editDoctor).subscribe({
      next: updated => {
        const idx = this.doctorList.findIndex(d => d.id === updated.id);
        if (idx > -1) this.doctorList[idx] = updated;
        this.applyFilters();
        this.cancelEdit();
        window.alert('Record saved successfully!');
      },
      error: err => {
        window.alert('Failed to save record. Please try again.');
      }
    });
  }

  deleteDoctor(id: number) {
    this.doctorService.deleteDoctor(id).subscribe(() => {
      this.doctorList = this.doctorList.filter(d => d.id !== id);
      this.applyFilters();
    });
  }
}

