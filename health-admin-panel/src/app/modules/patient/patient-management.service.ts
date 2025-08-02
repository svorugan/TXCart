import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  email: string;
  address: string;
  medicalHistory: string;
  surgeryType?: string;
  surgeryDate?: string;
  surgeon?: string;
  hospital?: string;
  implant?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies?: string;
  medications?: string;
  lastVisitDate?: string;
  nextAppointment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PatientManagementService {
  private apiUrl = '/api/patients';

  constructor(private http: HttpClient) { }

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Patient[]>('getPatients', []))
      );
  }

  getPatientById(id: number): Observable<Patient> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Patient>(url)
      .pipe(
        catchError(this.handleError<Patient>(`getPatientById id=${id}`))
      );
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient)
      .pipe(
        catchError(this.handleError<Patient>('addPatient'))
      );
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient)
      .pipe(
        catchError(this.handleError<Patient>(`updatePatient id=${id}`))
      );
  }

  deletePatient(id: number): Observable<Patient> {
    return this.http.delete<Patient>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Patient>(`deletePatient id=${id}`))
      );
  }

  searchPatients(term: string): Observable<Patient[]> {
    if (!term.trim()) {
      // If not search term, return all patients
      return this.getPatients();
    }
    return this.http.get<Patient[]>(`${this.apiUrl}?name_like=${term}`)
      .pipe(
        catchError(this.handleError<Patient[]>('searchPatients', []))
      );
  }

  // Helper method to handle HTTP operation errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
