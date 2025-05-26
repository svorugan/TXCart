import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hospital {
  id: number;
  name: string;
  location: string;
  address?: string;
  city: string;
  state: string;
  
  // Zone information
  zone?: string; // A+, A, B, C
  
  // Room categories
  roomCategories?: string[]; // Shared, Private, Suite
  
  // Accreditation
  accreditation?: string; // NABH, ISO, Non-accredited
  
  // Insurance
  insuranceTieups?: string[]; // CGHS, Aarogyasri, Private TPA
  
  // ICU
  hasICU?: boolean;
  
  // Surgery Volume
  surgeryVolume?: number; // Number of surgeries per year
  
  // Distance
  distance?: number; // Distance in km from user location
  distanceCategory?: string; // 0-5 km, 5-10 km, 10-20 km
  
  // Implant Ready
  implantTypes?: string[]; // Indian, Imported, Both
  
  // OT Type
  otType?: string; // Modular, Laminar Flow, Basic
  
  // Recovery Room
  recoveryRoomType?: string; // HDU, Private Ward, Day Care only
  
  // Surgeon Access
  allowsExternalSurgeons?: boolean;
  
  // Amenities
  amenities?: string[]; // Parking, Attender bed, Pharmacy, Lab onsite
  
  // Pricing Band
  pricingBand?: string; // < ₹50K, ₹50K-1L, ₹1L-2L, ₹2L+
  
  // Basic hospital info
  rating: number;
  reviewCount?: number;
  tier: string;
  imageUrl?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private apiUrl = 'http://localhost:3000/api/hospitals';

  constructor(private http: HttpClient) {}

  getHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(this.apiUrl);
  }

  getHospital(id: number): Observable<Hospital> {
    return this.http.get<Hospital>(`${this.apiUrl}/${id}`);
  }

  createHospital(hospital: Hospital): Observable<Hospital> {
    return this.http.post<Hospital>(this.apiUrl, hospital);
  }

  updateHospital(hospital: Hospital): Observable<Hospital> {
    return this.http.put<Hospital>(`${this.apiUrl}/${hospital.id}`, hospital);
  }

  deleteHospital(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

}
