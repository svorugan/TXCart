import { Component, OnInit } from '@angular/core';
import { Hospital, HospitalService } from './hospital.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hospital-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.scss']
})
export class HospitalListComponent implements OnInit {
  hospitals: Hospital[] = [];
  filteredHospitals: Hospital[] = [];
  displayedColumns = ['id', 'name', 'location', 'tier', 'city', 'state', 'rating', 'actions'];

  // Search fields
  searchHospitalName = '';
  searchLocation = '';
  searchTier = '';
  searchCity = '';
  searchState = '';
  searchRating: number | null = null;

  // Filter methods
  hasActiveFilters(): boolean {
    return !!this.searchHospitalName || 
           !!this.searchLocation || 
           !!this.searchTier || 
           !!this.searchCity || 
           !!this.searchState || 
           this.searchRating !== null;
  }
  
  clearFilter(filterName: string): void {
    switch(filterName) {
      case 'hospitalName':
        this.searchHospitalName = '';
        break;
      case 'location':
        this.searchLocation = '';
        break;
      case 'tier':
        this.searchTier = '';
        break;
      case 'city':
        this.searchCity = '';
        break;
      case 'state':
        this.searchState = '';
        break;
      case 'rating':
        this.searchRating = null;
        break;
    }
    this.applyFilters();
  }
  
  clearAllFilters(): void {
    this.searchHospitalName = '';
    this.searchLocation = '';
    this.searchTier = '';
    this.searchCity = '';
    this.searchState = '';
    this.searchRating = null;
    this.applyFilters();
  }

  states = ['CA', 'TX', 'NY', 'FL', 'IL'];

  constructor(private hospitalService: HospitalService) {}

  ngOnInit() {
    this.loadHospitals();
  }

  loadHospitals() {
    this.hospitalService.getHospitals().subscribe(hospitals => {
      this.hospitals = hospitals;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredHospitals = this.hospitals.filter(h =>
      (!this.searchHospitalName || h.name.toLowerCase().includes(this.searchHospitalName.toLowerCase())) &&
      (!this.searchLocation || h.location.toLowerCase().includes(this.searchLocation.toLowerCase())) &&
      (!this.searchTier || h.tier === this.searchTier) &&
      (!this.searchCity || h.city.toLowerCase().includes(this.searchCity.toLowerCase())) &&
      (!this.searchState || h.state === this.searchState) &&
      (this.searchRating == null || h.rating >= this.searchRating)
    );
  }



  deleteHospital(id: number) {
    if (!confirm('Are you sure you want to delete this hospital?')) return;
    this.hospitalService.deleteHospital(id).subscribe(() => {
      this.loadHospitals();
      window.alert('Hospital deleted successfully!');
    });
  }
}
