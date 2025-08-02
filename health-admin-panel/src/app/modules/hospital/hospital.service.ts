import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospital } from './hospital.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private hospitalsUrl = `${environment.apiUrl}/hospitals`;

  constructor(private http: HttpClient) { }

  getHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(this.hospitalsUrl);
  }

  getHospital(id: number | string): Observable<Hospital> {
    return this.http.get<Hospital>(`${this.hospitalsUrl}/${id}`);
  }

  // Search hospitals by filters (client-side filtering; for server-side, pass filters as query params)
  searchHospitals(filters: Partial<Hospital>): Observable<Hospital[]> {
    // For server-side filtering, you would pass filters as query params
    // return this.http.get<Hospital[]>(this.hospitalsUrl, { params: filters as any });
    return this.http.get<Hospital[]>(this.hospitalsUrl); // Filter in component after fetching
  }

  // Add a new hospital
  addHospital(hospital: Hospital): Observable<Hospital> {
    return this.http.post<Hospital>(this.hospitalsUrl, hospital);
  }

  // Update an existing hospital
  updateHospital(id: number | string, hospital: Hospital): Observable<Hospital> {
    return this.http.put<Hospital>(`${this.hospitalsUrl}/${id}`, hospital);
  }
}
