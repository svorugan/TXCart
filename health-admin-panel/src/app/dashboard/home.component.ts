import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {
  doctorsCount = 0;
  hospitalsCount = 0;
  diagnosticsCount = 0;
  implantsCount = 0;
  patientsCount = 0;
  topDoctors: { name: string; count: number }[] = [];
  topHospitals: { name: string; count: number }[] = [];
  topFields: { field: string; count: number }[] = [];
  doctors: any[] = [];
  hospitals: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/doctors').subscribe(data => {
      this.doctors = data;
      this.doctorsCount = data.length;
    });
    this.http.get<any[]>('http://localhost:3000/api/hospitals').subscribe(data => {
      this.hospitals = data;
      this.hospitalsCount = data.length;
    });
    this.http.get<any[]>('http://localhost:3000/api/diagnostics').subscribe(data => {
      this.diagnosticsCount = data.length;
    });
    this.http.get<any[]>('http://localhost:3000/api/implants').subscribe(data => {
      this.implantsCount = data.length;
    });
    this.http.get<any[]>('http://localhost:3000/api/patients').subscribe(patients => {
      this.patientsCount = patients.length;
      // Top preferred doctors
      const docMap: { [id: number]: number } = {};
      patients.forEach(p => { if (p.preferredDoctorId) docMap[p.preferredDoctorId] = (docMap[p.preferredDoctorId] || 0) + 1; });
      this.topDoctors = Object.entries(docMap)
        .map(([id, count]) => ({ name: this.doctors.find(d => d.id == +id)?.name || 'Unknown', count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      // Top hospitals
      const hospMap: { [id: number]: number } = {};
      patients.forEach(p => { if (p.preferredHospitalId) hospMap[p.preferredHospitalId] = (hospMap[p.preferredHospitalId] || 0) + 1; });
      this.topHospitals = Object.entries(hospMap)
        .map(([id, count]) => ({ name: this.hospitals.find(h => h.id == +id)?.name || 'Unknown', count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      // Top fields
      const fieldMap: { [field: string]: number } = {};
      patients.forEach(p => { if (p.field) fieldMap[p.field] = (fieldMap[p.field] || 0) + 1; });
      this.topFields = Object.entries(fieldMap)
        .map(([field, count]) => ({ field, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    });
  }
}
