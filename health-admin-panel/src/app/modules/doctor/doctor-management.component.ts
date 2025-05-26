import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Doctor } from './doctor.model';
import { DoctorService } from './doctor.service';

@Component({
  selector: 'app-doctor-management',
  templateUrl: './doctor-management.component.html',
  styleUrls: ['./doctor-management.component.scss']
})
export class DoctorManagementComponent implements OnInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchForm: FormGroup;

  constructor(private fb: FormBuilder, private doctorService: DoctorService, private router: Router) {
    this.searchForm = this.fb.group({
      name: [''],
      experience: [''],
      fellowshipType: [''],
      locationBase: [''],
      availability: [''],
      languagesSpoken: [''],
      gender: ['']
    });
  }

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe(doctors => {
      this.doctors = doctors;
      this.filteredDoctors = doctors;
    });
  }

  searchDoctors() {
    const filters = this.searchForm.value;
    this.filteredDoctors = this.doctors.filter(d => {
      return (!filters.name || d.name.toLowerCase().includes(filters.name.toLowerCase())) &&
             (!filters.experience || d.experience === filters.experience) &&
             (!filters.fellowshipType || d.fellowshipType === filters.fellowshipType) &&
             (!filters.locationBase || d.locationBase === filters.locationBase) &&
             (!filters.availability || d.availability === filters.availability) &&
             (!filters.languagesSpoken || d.languagesSpoken.join(',').toLowerCase().includes(filters.languagesSpoken.toLowerCase())) &&
             (!filters.gender || d.gender === filters.gender);
    });
  }

  resetSearch() {
    this.searchForm.reset();
    this.filteredDoctors = this.doctors;
  }

  startAdd() {
    this.router.navigate(['/doctors/add']);
  }

  startEdit(doctor: Doctor) {
    this.router.navigate(['/doctors/edit', doctor.id]);
  }


}
