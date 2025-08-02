import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DiagnosticTest {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  preparationRequired: boolean;
  preparationInstructions?: string;
  reportTime: number; // Time in hours to get the report
  category: string;
  recommended: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DiagnosticsService {
  private apiUrl = `${environment.apiUrl}/diagnostics`;

  constructor(private http: HttpClient) { }

  getDiagnosticTests(): Observable<DiagnosticTest[]> {
    return this.http.get<DiagnosticTest[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<DiagnosticTest[]>('getDiagnosticTests', []))
      );
  }

  getDiagnosticTestById(id: string): Observable<DiagnosticTest> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<DiagnosticTest>(url)
      .pipe(
        catchError(this.handleError<DiagnosticTest>(`getDiagnosticTestById id=${id}`))
      );
  }

  getDiagnosticTestsByCategory(category: string): Observable<DiagnosticTest[]> {
    return this.http.get<DiagnosticTest[]>(`${this.apiUrl}?category=${category}`)
      .pipe(
        catchError(this.handleError<DiagnosticTest[]>(`getDiagnosticTestsByCategory category=${category}`, []))
      );
  }

  getRecommendedTests(): Observable<DiagnosticTest[]> {
    return this.http.get<DiagnosticTest[]>(`${this.apiUrl}?recommended=true`)
      .pipe(
        catchError(this.handleError<DiagnosticTest[]>('getRecommendedTests', []))
      );
  }

  addDiagnosticTest(test: DiagnosticTest): Observable<DiagnosticTest> {
    return this.http.post<DiagnosticTest>(this.apiUrl, test)
      .pipe(
        catchError(this.handleError<DiagnosticTest>('addDiagnosticTest'))
      );
  }

  updateDiagnosticTest(id: string, test: DiagnosticTest): Observable<DiagnosticTest> {
    return this.http.put<DiagnosticTest>(`${this.apiUrl}/${id}`, test)
      .pipe(
        catchError(this.handleError<DiagnosticTest>(`updateDiagnosticTest id=${id}`))
      );
  }

  deleteDiagnosticTest(id: string): Observable<DiagnosticTest> {
    return this.http.delete<DiagnosticTest>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<DiagnosticTest>(`deleteDiagnosticTest id=${id}`))
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
