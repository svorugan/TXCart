import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  
  // Experience
  yearsExperience?: number;
  postFellowshipYears?: number;
  
  // Fellowship Type
  fellowshipType?: 'National' | 'International' | 'Multiple';
  fellowshipDetails?: string; // For storing details like DNB, FNB, country names, etc.
  
  // Location Base
  city?: string;
  state?: string;
  isLocal?: boolean;
  isVisiting?: boolean;
  visitingCities?: string[];
  
  // Availability
  availableNextDays?: number;
  hasWeekendSlots?: boolean;
  availabilityNotes?: string;
  
  // Surgery Volume
  surgeryCount?: number;
  surgeryTypes?: string[];
  verifiedSurgeryCount?: boolean;
  
  // Implant Preference
  offersIndianImplants?: boolean;
  offersImportedImplants?: boolean;
  implantPreferences?: string[];
  
  // Ratings & Reviews
  patientRating?: number;
  reviewCount?: number;
  externalRatings?: {
    source: string;
    rating: number;
    link?: string;
  }[];
  
  // Academic Merit
  hasPublications?: boolean;
  publicationCount?: number;
  isSpeaker?: boolean;
  speakerEvents?: string[];
  academicNotes?: string;
  
  // Languages
  languages?: string[];
  
  // Gender
  gender?: 'Male' | 'Female' | 'Other';
  
  // Additional fields
  imageUrl?: string;
  bio?: string;
  cost?: number;
  contactInfo?: string;
  email?: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private apiUrl = '/api/doctors';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  createDoctor(data: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, data);
  }

  updateDoctor(data: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/${data.id}`, data);
  }

  deleteDoctor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
