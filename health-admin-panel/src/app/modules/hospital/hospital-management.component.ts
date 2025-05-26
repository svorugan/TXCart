import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Hospital } from './hospital.model';
import { HospitalService } from './hospital.service';

@Component({
  selector: 'app-hospital-management',
  templateUrl: './hospital-management.component.html',
  styleUrls: ['./hospital-management.component.scss']
})
export class HospitalManagementComponent implements OnInit {
  hospitals: Hospital[] = [];
  filteredHospitals: Hospital[] = [];
  searchForm: FormGroup;
  hospitalForm: FormGroup;
  editingHospital: Hospital | null = null;
  showForm: boolean = false;

  constructor(private fb: FormBuilder, private hospitalService: HospitalService) {
    this.searchForm = this.fb.group({
      name: [''],
      locationBase: [''],
      availability: [''],
      languagesSpoken: [''],
      genderPreference: ['']
    });
    this.hospitalForm = this.fb.group({
      id: [''],
      name: [''],
      locationBase: [''],
      availability: [''],
      languagesSpoken: [''],
      genderPreference: [''],
      ratings: [''],
      externalRatings: [''],
      academicMerit: [''],
      fellowshipType: [''],
      experience: [''],
      surgeryVolume: [''],
      implantPreference: ['']
    });
  }

  ngOnInit() {
    this.loadHospitals();
  }

  loadHospitals() {
    this.hospitalService.getHospitals().subscribe(hospitals => {
      this.hospitals = hospitals;
      this.filteredHospitals = hospitals;
    });
  }

  searchHospitals() {
    const filters = this.searchForm.value;
    this.filteredHospitals = this.hospitals.filter(h => {
      return (!filters.name || h.name.toLowerCase().includes(filters.name.toLowerCase())) &&
             (!filters.locationBase || h.locationBase === filters.locationBase) &&
             (!filters.availability || h.availability === filters.availability) &&
             (!filters.languagesSpoken || h.languagesSpoken.join(',').toLowerCase().includes(filters.languagesSpoken.toLowerCase())) &&
             (!filters.genderPreference || h.genderPreference === filters.genderPreference);
    });
  }

  resetSearch() {
    this.searchForm.reset();
    this.filteredHospitals = this.hospitals;
  }

  startAdd() {
    this.editingHospital = null;
    this.hospitalForm.reset();
    this.showForm = true;
  }

  startEdit(hospital: Hospital) {
    this.editingHospital = hospital;
    this.hospitalForm.patchValue(hospital);
    this.showForm = true;
  }

  saveHospital() {
    const formValue = this.hospitalForm.value;
    if (this.editingHospital) {
      this.hospitalService.updateHospital(this.editingHospital.id!, formValue).subscribe(() => {
        this.loadHospitals();
        this.showForm = false;
      });
    } else {
      this.hospitalService.addHospital(formValue).subscribe(() => {
        this.loadHospitals();
        this.showForm = false;
      });
    }
  }

  cancelForm() {
    this.showForm = false;
    this.editingHospital = null;
  }
}
