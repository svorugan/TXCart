import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from './doctor.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private doctorsUrl = `${environment.apiUrl}/doctors`;

  constructor(private http: HttpClient) { }

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.doctorsUrl);
  }

  getDoctor(id: number | string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.doctorsUrl}/${id}`);
  }

  // Search doctors by filters (client-side filtering; for server-side, pass filters as query params)
  searchDoctors(filters: Partial<Doctor>): Observable<Doctor[]> {
    // For server-side filtering, you would pass filters as query params
    // return this.http.get<Doctor[]>(this.doctorsUrl, { params: filters as any });
    return this.http.get<Doctor[]>(this.doctorsUrl); // Filter in component after fetching
  }

  // Add a new doctor
  addDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.doctorsUrl, doctor);
  }

  // Update an existing doctor
  updateDoctor(id: number | string, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.doctorsUrl}/${id}`, doctor);
  }
}
