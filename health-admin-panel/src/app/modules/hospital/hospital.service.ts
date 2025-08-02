import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Hospital } from './hospital.model';
import { environment } from '../../../environments/environment';

interface BackendHospital {
  id: number | string;
  name: string;
  description: string;
  color: string;
  location: { lat: number; lng: number };
}

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private hospitalsUrl = `${environment.apiUrl}/hospitals`;

  constructor(private http: HttpClient) { }

  getHospitals(): Observable<Hospital[]> {
    return this.http.get<BackendHospital[]>(this.hospitalsUrl)
      .pipe(
        map(backendHospitals => this.transformHospitals(backendHospitals))
      );
  }

  getHospital(id: number | string): Observable<Hospital> {
    return this.http.get<BackendHospital>(`${this.hospitalsUrl}/${id}`)
      .pipe(
        map(backendHospital => this.transformHospital(backendHospital))
      );
  }

  // Search hospitals by filters (client-side filtering; for server-side, pass filters as query params)
  searchHospitals(filters: Partial<Hospital>): Observable<Hospital[]> {
    // For server-side filtering, you would pass filters as query params
    // return this.http.get<Hospital[]>(this.hospitalsUrl, { params: filters as any });
    return this.http.get<BackendHospital[]>(this.hospitalsUrl)
      .pipe(
        map(backendHospitals => this.transformHospitals(backendHospitals))
      );
  }

  // Add a new hospital
  addHospital(hospital: Hospital): Observable<Hospital> {
    return this.http.post<BackendHospital>(this.hospitalsUrl, hospital)
      .pipe(
        map(backendHospital => this.transformHospital(backendHospital))
      );
  }

  // Update an existing hospital
  updateHospital(id: number | string, hospital: Hospital): Observable<Hospital> {
    return this.http.put<BackendHospital>(`${this.hospitalsUrl}/${id}`, hospital)
      .pipe(
        map(backendHospital => this.transformHospital(backendHospital))
      );
  }

  // Transform a single backend hospital to frontend model
  private transformHospital(backendHospital: BackendHospital): Hospital {
    return {
      id: backendHospital.id,
      name: backendHospital.name,
      locationBase: backendHospital.description || '',
      availability: 'Available', // Default value
      languagesSpoken: ['English', 'Hindi'], // Default languages
      genderPreference: 'Any', // Default value
      ratings: 4, // Default rating
      externalRatings: '',
      academicMerit: '',
      fellowshipType: '',
      experience: '',
      surgeryVolume: 0,
      implantPreference: ''
    };
  }

  // Transform an array of backend hospitals
  private transformHospitals(backendHospitals: BackendHospital[]): Hospital[] {
    return backendHospitals.map(hospital => this.transformHospital(hospital));
  }
}
