import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return new Observable<Surgeon[]>(observer => {
      const mockSurgeons: Surgeon[] = [
        {
          id: 1,
          name: 'Dr. Rajesh Kumar',
          specialty: 'Orthopedic Surgeon',
          rating: 4.8,
          reviews: 120,
          reviewCount: 120,
          imageUrl: 'assets/images/doctor1.jpg',
          avatar: 'assets/images/doctor1.jpg',
          yearsExperience: 15,
          experience: 15,
          qualification: 'MS Ortho, Fellowship in Joint Replacement',
          hospital: 'Apollo Hospitals',
          fellowshipType: 'International',
          city: 'Mumbai',
          isLocal: true,
          isVisiting: false,
          availableNextDays: 5,
          availableIn: 5,
          hasWeekendSlots: true,
          surgeryCount: 1200,
          offersIndianImplants: true,
          offersImportedImplants: true,
          hasPublications: true,
          languages: ['English', 'Hindi', 'Marathi'],
        },
        {
          id: 2,
          name: 'Dr. Priya Sharma',
          specialty: 'Orthopedic Surgeon',
          rating: 4.5,
          reviews: 85,
          reviewCount: 85,
          imageUrl: 'assets/images/doctor2.jpg',
          avatar: 'assets/images/doctor2.jpg',
          yearsExperience: 10,
          experience: 10,
          qualification: 'DNB Ortho, Fellowship in Arthroscopy',
          hospital: 'Max Healthcare',
          fellowshipType: 'National',
          city: 'Delhi',
          isLocal: false,
          isVisiting: true,
          availableNextDays: 3,
          availableIn: 3,
          hasWeekendSlots: false,
          surgeryCount: 750,
          offersIndianImplants: true,
          offersImportedImplants: false,
          hasPublications: false,
          languages: ['English', 'Hindi', 'Punjabi'],
        },
        {
          id: 3,
          name: 'Dr. Anil Patel',
          specialty: 'Orthopedic Surgeon',
          rating: 4.2,
          reviews: 78,
          reviewCount: 78,
          imageUrl: 'assets/images/doctor3.jpg',
          avatar: 'assets/images/doctor3.jpg',
          yearsExperience: 8,
          experience: 8,
          qualification: 'MS Ortho, Specialization in Sports Medicine',
          hospital: 'Fortis Hospital',
          fellowshipType: 'National',
          city: 'Bangalore',
          isLocal: true,
          isVisiting: false,
          availableNextDays: 15,
          availableIn: 15,
          hasWeekendSlots: true,
          surgeryCount: 500,
          offersIndianImplants: true,
          offersImportedImplants: true,
          hasPublications: false,
          languages: ['English', 'Kannada', 'Hindi'],
        },
        {
          id: 4,
          name: 'Dr. Sunita Reddy',
          specialty: 'Orthopedic Surgeon',
          rating: 4.9,
          reviews: 150,
          reviewCount: 150,
          imageUrl: 'assets/images/doctor4.jpg',
          avatar: 'assets/images/doctor4.jpg',
          yearsExperience: 20,
          experience: 20,
          qualification: 'MS Ortho, FRCS, Fellowship in Joint Replacement',
          hospital: 'KIMS Hospital',
          fellowshipType: 'International',
          city: 'Hyderabad',
          isLocal: true,
          isVisiting: false,
          availableNextDays: 3,
          availableIn: 3,
          hasWeekendSlots: true,
          surgeryCount: 1500,
          offersIndianImplants: true,
          offersImportedImplants: true,
          hasPublications: true,
          languages: ['English', 'Telugu', 'Hindi']
        },
        {
          id: 5,
          name: 'Dr. Vikram Singh',
          specialty: 'Orthopedic Surgeon',
          rating: 4.0,
          reviews: 65,
          reviewCount: 65,
          imageUrl: 'assets/images/doctor5.jpg',
          avatar: 'assets/images/doctor5.jpg',
          yearsExperience: 6,
          experience: 6,
          qualification: 'MS Ortho, Specialization in Trauma',
          hospital: 'Apollo Hospitals',
          fellowshipType: 'None',
          city: 'Chennai',
          isLocal: false,
          isVisiting: true,
          availableNextDays: 7,
          availableIn: 7,
          hasWeekendSlots: false,
          surgeryCount: 350,
          offersIndianImplants: true,
          offersImportedImplants: false,
          hasPublications: false,
          languages: ['English', 'Tamil', 'Hindi']
        },
        {
          id: 6,
          name: 'Dr. Meena Gupta',
          specialty: 'Orthopedic Surgeon',
          rating: 4.6,
          reviews: 110,
          reviewCount: 110,
          imageUrl: 'assets/images/doctor6.jpg',
          avatar: 'assets/images/doctor6.jpg',
          yearsExperience: 12,
          experience: 12,
          qualification: 'DNB Ortho, Fellowship in Joint Replacement',
          hospital: 'Lilavati Hospital',
          fellowshipType: 'National',
          city: 'Mumbai',
          isLocal: true,
          isVisiting: false,
          availableNextDays: 10,
          availableIn: 10,
          hasWeekendSlots: true,
          surgeryCount: 900,
          offersIndianImplants: true,
          offersImportedImplants: true,
          hasPublications: true,
          languages: ['English', 'Marathi', 'Hindi']
        },
      ];

      observer.next(mockSurgeons);
      observer.complete();
    });
  }

  getImplants(): Observable<Implant[]> {
    return this.http.get<Implant[]>(this.implantsUrl);
  }

  getHospitalZones(): Observable<HospitalZone[]> {
    return this.http.get<HospitalZone[]>(this.zonesUrl);
  }
}
