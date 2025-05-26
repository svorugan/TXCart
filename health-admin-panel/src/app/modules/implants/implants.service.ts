import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Implant {
  id: string;
  name: string;
  manufacturer: string;
  origin: 'Indian' | 'Imported';
  tier: 'Economy' | 'Standard' | 'Premium';
  description: string;
  price: number;
  warranty: number; // Warranty in years
  longevity: number; // Expected longevity in years
  materials: string[];
  compatibleSurgeries: string[];
  features: string[];
}

// Surgery types mapping for display purposes
export const surgeryTypeMap: Record<string, string> = {
  'knee-replacement-total': 'Total Knee Replacement',
  'knee-replacement-partial': 'Partial Knee Replacement',
  'knee-revision': 'Knee Revision Surgery',
  'hip-replacement-total': 'Total Hip Replacement',
  'hip-replacement-partial': 'Partial Hip Replacement',
  'hip-resurfacing': 'Hip Resurfacing',
  'hip-revision': 'Hip Revision Surgery',
  'shoulder-replacement-total': 'Total Shoulder Replacement',
  'shoulder-replacement-partial': 'Partial Shoulder Replacement',
  'shoulder-replacement-reverse': 'Reverse Shoulder Replacement',
  'elbow-replacement-total': 'Total Elbow Replacement',
  'ankle-replacement-total': 'Total Ankle Replacement',
  'spine-disc-replacement': 'Spinal Disc Replacement',
  'spine-fusion': 'Spinal Fusion'
}

@Injectable({
  providedIn: 'root'
})
export class ImplantsService {
  private apiUrl = 'http://localhost:3000/api/implants';

  constructor(private http: HttpClient) { }

  getImplants(): Observable<Implant[]> {
    return this.http.get<Implant[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<Implant[]>('getImplants', []))
      );
  }

  getImplantById(id: string): Observable<Implant> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Implant>(url)
      .pipe(
        catchError(this.handleError<Implant>(`getImplantById id=${id}`))
      );
  }

  getImplantsByTier(tier: 'Economy' | 'Standard' | 'Premium'): Observable<Implant[]> {
    return this.http.get<Implant[]>(`${this.apiUrl}?tier=${tier}`)
      .pipe(
        catchError(this.handleError<Implant[]>(`getImplantsByTier tier=${tier}`, []))
      );
  }

  getImplantsByOrigin(origin: 'Indian' | 'Imported'): Observable<Implant[]> {
    return this.http.get<Implant[]>(`${this.apiUrl}?origin=${origin}`)
      .pipe(
        catchError(this.handleError<Implant[]>(`getImplantsByOrigin origin=${origin}`, []))
      );
  }

  getImplantsBySurgery(surgeryId: string): Observable<Implant[]> {
    return this.http.get<Implant[]>(`${this.apiUrl}?compatibleSurgeries=${surgeryId}`)
      .pipe(
        catchError(this.handleError<Implant[]>(`getImplantsBySurgery surgeryId=${surgeryId}`, []))
      );
  }
  
  // Add a new implant
  addImplant(implant: Implant): Observable<Implant> {
    return this.http.post<Implant>(this.apiUrl, implant)
      .pipe(
        catchError(this.handleError<Implant>('addImplant'))
      );
  }
  
  // Update an existing implant
  updateImplant(id: string, implant: Implant): Observable<Implant> {
    return this.http.put<Implant>(`${this.apiUrl}/${id}`, implant)
      .pipe(
        catchError(this.handleError<Implant>(`updateImplant id=${id}`))
      );
  }
  
  // Delete an implant
  deleteImplant(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<any>(`deleteImplant id=${id}`))
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
