import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Surgeon {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviewCount?: number; // Using optional property for compatibility
  reviews?: number;
  avatar?: string;
  imageUrl?: string;
  experience?: number;
  yearsExperience?: number;
  qualification: string;
  hospital?: string;
  fellowshipType: string;
  city: string;
  isLocal: boolean;
  isVisiting: boolean;
  availableNextDays: number;
  availableIn?: number; // Alias for availableNextDays
  hasWeekendSlots: boolean;
  surgeryCount: number;
  offersIndianImplants: boolean;
  offersImportedImplants: boolean;
  hasPublications: boolean;
  languages: string[];
}

export interface Implant {
  id: number;
  name: string;
  description: string;
  tier: string;
}

export interface HospitalZone {
  id: number;
  name: string;
  description?: string;
  color?: string;
  location?: { lat: number; lng: number };
  lat?: number;
  lng?: number;
}

export interface Surgery {
  id: string;
  name: string;
  description: string;
  recoveryTime: string;
  painLevel: string;
  successRate: string;
  type: string; // 'knee' or 'hip'
  side: string; // 'left' or 'right'
  isTotal: boolean;
  isPartial: boolean;
  isReplacement: boolean;
  isRevision: boolean;
  price: number;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  // Using mock data instead of API endpoints
  private useMockData = true;
  private surgeonsUrl = '/api/doctors';
  private implantsUrl = '/api/implants';
  private zonesUrl = '/api/hospitals';

  constructor(private http: HttpClient) {}

  getSurgeons(): Observable<Surgeon[]> {
    // Mock data for surgeons with filter fields
    return this.http.get<Surgeon[]>(this.surgeonsUrl);
  }

  getImplants(): Observable<Implant[]> {
    return this.http.get<Implant[]>(this.implantsUrl);
  }

  getHospitalZones(): Observable<HospitalZone[]> {
    return this.http.get<HospitalZone[]>(this.zonesUrl);
  }

  getSurgeries(): Observable<Surgery[]> {
    // Mock data for surgeries
    const surgeries: Surgery[] = [
      {
        id: 'total-left-knee',
        name: 'Total Knee Replacement (Left)',
        description: 'Complete replacement of the left knee joint',
        recoveryTime: '4-6 weeks',
        painLevel: 'Moderate',
        successRate: '95%',
        type: 'knee',
        side: 'left',
        isTotal: true,
        isPartial: false,
        isReplacement: true,
        isRevision: false,
        price: 150000,
        image: 'assets/images/total-left.jpg'
      },
      {
        id: 'total-right-knee',
        name: 'Total Knee Replacement (Right)',
        description: 'Complete replacement of the right knee joint',
        recoveryTime: '4-6 weeks',
        painLevel: 'Moderate',
        successRate: '95%',
        type: 'knee',
        side: 'right',
        isTotal: true,
        isPartial: false,
        isReplacement: true,
        isRevision: false,
        price: 150000,
        image: 'assets/images/total-right.jpg'
      },
      {
        id: 'partial-left-knee',
        name: 'Partial Knee Replacement (Left)',
        description: 'Partial replacement of the left knee joint',
        recoveryTime: '3-5 weeks',
        painLevel: 'Mild to Moderate',
        successRate: '90%',
        type: 'knee',
        side: 'left',
        isTotal: false,
        isPartial: true,
        isReplacement: true,
        isRevision: false,
        price: 120000,
        image: 'assets/images/partial-left.jpg'
      },
      {
        id: 'partial-right-knee',
        name: 'Partial Knee Replacement (Right)',
        description: 'Partial replacement of the right knee joint',
        recoveryTime: '3-5 weeks',
        painLevel: 'Mild to Moderate',
        successRate: '90%',
        type: 'knee',
        side: 'right',
        isTotal: false,
        isPartial: true,
        isReplacement: true,
        isRevision: false,
        price: 120000,
        image: 'assets/images/partial-right.jpg'
      },
      {
        id: 'total-left-hip',
        name: 'Total Hip Replacement (Left)',
        description: 'Complete replacement of the left hip joint',
        recoveryTime: '4-6 weeks',
        painLevel: 'Moderate',
        successRate: '96%',
        type: 'hip',
        side: 'left',
        isTotal: true,
        isPartial: false,
        isReplacement: true,
        isRevision: false,
        price: 180000,
        image: 'assets/images/hip-left.jpg'
      },
      {
        id: 'total-right-hip',
        name: 'Total Hip Replacement (Right)',
        description: 'Complete replacement of the right hip joint',
        recoveryTime: '4-6 weeks',
        painLevel: 'Moderate',
        successRate: '96%',
        type: 'hip',
        side: 'right',
        isTotal: true,
        isPartial: false,
        isReplacement: true,
        isRevision: false,
        price: 180000,
        image: 'assets/images/hip-right.jpg'
      },
      {
        id: 'revision-left-knee',
        name: 'Revision Knee Surgery (Left)',
        description: 'Revision of a previous left knee replacement',
        recoveryTime: '6-8 weeks',
        painLevel: 'Moderate to Severe',
        successRate: '85%',
        type: 'knee',
        side: 'left',
        isTotal: true,
        isPartial: false,
        isReplacement: false,
        isRevision: true,
        price: 200000,
        image: 'assets/images/revision-left.jpg'
      },
      {
        id: 'revision-right-knee',
        name: 'Revision Knee Surgery (Right)',
        description: 'Revision of a previous right knee replacement',
        recoveryTime: '6-8 weeks',
        painLevel: 'Moderate to Severe',
        successRate: '85%',
        type: 'knee',
        side: 'right',
        isTotal: true,
        isPartial: false,
        isReplacement: false,
        isRevision: true,
        price: 200000,
        image: 'assets/images/revision-right.jpg'
      }
    ];
    
    return of(surgeries);
  }
}
