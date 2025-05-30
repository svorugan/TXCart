import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Angular Material Imports
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';

interface Surgery {
  id: number;
  name: string;
  description: string;
  type: string;
  side?: string;
  isTotal?: boolean;
  isPartial?: boolean;
  isReplacement?: boolean;
  isRevision?: boolean;
  price: number;
  recoveryTime: string;
  image: string;
}

interface Surgeon {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  hospital: string;
  availability: string;
  image: string;
  bio: string;
  price: number;
  procedures: number;
}

interface Implant {
  id: number;
  name: string;
  manufacturer: string;
  material: string;
  durability: string;
  price: number;
  tier: string;
  description: string;
  image: string;
}

interface HospitalZone {
  id: number;
  name: string;
  address: string;
  rating: number;
  facilities: string[];
  lat: number;
  lng: number;
}

interface SurgeryFilters {
  type: string | null;
  side: string | null;
  isTotal: boolean | null;
  isPartial: boolean | null;
  isReplacement: boolean | null;
  isRevision: boolean | null;
  priceRange: number[];
}

interface SurgeonFilters {
  specialty: string | null;
  experience: number | null;
  rating: number | null;
  hospital: string | null;
}

@Component({
  selector: 'app-patient-journey',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSliderModule,
    MatSnackBarModule,
    MatListModule
  ],
  templateUrl: './patient-journey.component.html',
  styleUrls: ['./patient-journey.component.scss']
})
export class PatientJourneyComponent implements OnInit {
  currentStep = 0;
  patientForm: FormGroup;
  filterOpen = false;
  
  surgeries: Surgery[] = [];
  filteredSurgeries: Surgery[] = [];
  selectedSurgery: Surgery | null = null;
  
  surgeons: Surgeon[] = [];
  filteredSurgeons: Surgeon[] = [];
  selectedSurgeon: Surgeon | null = null;
  
  implants: Implant[] = [];
  filteredImplants: Implant[] = [];
  selectedImplant: Implant | null = null;
  
  hospitalZones: HospitalZone[] = [];
  selectedHospitalZone: HospitalZone | null = null;
  
  surgeryFilters: SurgeryFilters = {
    type: null,
    side: null,
    isTotal: null,
    isPartial: null,
    isReplacement: null,
    isRevision: null,
    priceRange: [50000, 250000]
  };
  
  filters: SurgeonFilters = {
    specialty: null,
    experience: null,
    rating: null,
    hospital: null
  };
  
  surgeryTypes = ['Knee', 'Hip', 'Shoulder', 'Spine', 'Elbow'];
  sideoptions = ['Left', 'Right', 'Bilateral'];
  specialties = ['Orthopedic', 'Neurosurgery', 'Cardiology', 'General'];
  
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      medicalHistory: [''],
      preferredDate: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.loadSurgeries();
    this.loadSurgeons();
    this.loadImplants();
    this.loadHospitalZones();
  }
  
  loadSurgeries(): void {
    // In a real app, this would come from an API
    this.surgeries = [
      {
        id: 1,
        name: 'Total Knee Replacement',
        description: 'Replaces damaged knee joint with artificial implant',
        type: 'Knee',
        side: 'Right',
        isTotal: true,
        isReplacement: true,
        price: 150000,
        recoveryTime: '3-6 months',
        image: 'assets/images/knee-surgery.jpg'
      },
      {
        id: 2,
        name: 'Partial Hip Replacement',
        description: 'Replaces only damaged part of hip joint',
        type: 'Hip',
        side: 'Left',
        isPartial: true,
        isReplacement: true,
        price: 120000,
        recoveryTime: '2-4 months',
        image: 'assets/images/hip-surgery.jpg'
      },
      {
        id: 3,
        name: 'Spine Fusion Surgery',
        description: 'Joins two or more vertebrae together',
        type: 'Spine',
        price: 200000,
        recoveryTime: '6-12 months',
        image: 'assets/images/spine-surgery.jpg'
      }
    ];
    this.filteredSurgeries = [...this.surgeries];
  }
  
  loadSurgeons(): void {
    // In a real app, this would come from an API
    this.surgeons = [
      {
        id: 1,
        name: 'Dr. Anil Sharma',
        specialty: 'Orthopedic',
        experience: 15,
        rating: 4.8,
        reviews: 120,
        hospital: 'Apollo Hospital',
        availability: 'Available next week',
        image: 'assets/images/doctor1.jpg',
        bio: 'Specializes in knee and hip replacements with over 15 years of experience.',
        price: 50000,
        procedures: 500
      },
      {
        id: 2,
        name: 'Dr. Priya Patel',
        specialty: 'Orthopedic',
        experience: 12,
        rating: 4.6,
        reviews: 95,
        hospital: 'Fortis Hospital',
        availability: 'Available this week',
        image: 'assets/images/doctor2.jpg',
        bio: 'Expert in minimally invasive joint replacement surgeries.',
        price: 45000,
        procedures: 350
      },
      {
        id: 3,
        name: 'Dr. Rajesh Kumar',
        specialty: 'Neurosurgery',
        experience: 20,
        rating: 4.9,
        reviews: 150,
        hospital: 'AIIMS',
        availability: 'Limited availability',
        image: 'assets/images/doctor3.jpg',
        bio: 'Pioneer in spine surgeries with international training.',
        price: 60000,
        procedures: 700
      }
    ];
    this.filteredSurgeons = [...this.surgeons];
  }
  
  loadImplants(): void {
    // In a real app, this would come from an API
    this.implants = [
      {
        id: 1,
        name: 'Premium Knee Implant',
        manufacturer: 'Johnson & Johnson',
        material: 'Titanium Alloy',
        durability: '20+ years',
        price: 80000,
        tier: 'Premium',
        description: 'High-end implant with excellent durability and mobility',
        image: 'assets/images/implant1.jpg'
      },
      {
        id: 2,
        name: 'Standard Hip Implant',
        manufacturer: 'Smith & Nephew',
        material: 'Cobalt-Chromium',
        durability: '15-20 years',
        price: 60000,
        tier: 'Standard',
        description: 'Reliable implant with good durability and cost-effectiveness',
        image: 'assets/images/implant2.jpg'
      },
      {
        id: 3,
        name: 'Economy Spine Implant',
        manufacturer: 'Medtronic',
        material: 'Stainless Steel',
        durability: '10-15 years',
        price: 40000,
        tier: 'Economy',
        description: 'Budget-friendly option with acceptable durability',
        image: 'assets/images/implant3.jpg'
      }
    ];
    this.filteredImplants = [...this.implants];
  }
  
  loadHospitalZones(): void {
    // In a real app, this would come from an API
    this.hospitalZones = [
      {
        id: 1,
        name: 'Apollo Hospital',
        address: 'Jubilee Hills, Hyderabad',
        rating: 4.7,
        facilities: ['ICU', 'Rehabilitation Center', 'Specialized Orthopedic Wing'],
        lat: 17.4126,
        lng: 78.4476
      },
      {
        id: 2,
        name: 'Fortis Hospital',
        address: 'Bannerghatta Road, Bangalore',
        rating: 4.5,
        facilities: ['Advanced Imaging', 'Physical Therapy', 'Joint Replacement Center'],
        lat: 12.9716,
        lng: 77.5946
      },
      {
        id: 3,
        name: 'AIIMS',
        address: 'Ansari Nagar, New Delhi',
        rating: 4.9,
        facilities: ['Research Center', 'Trauma Care', 'Specialized Surgical Units'],
        lat: 28.5672,
        lng: 77.2100
      }
    ];
  }
  
  nextStep(): void {
    if (this.currentStep === 0 && !this.selectedSurgery) {
      this.snackBar.open('Please select a surgery to continue', 'Close', { duration: 3000 });
      return;
    }
    
    if (this.currentStep === 1 && !this.selectedSurgeon) {
      this.snackBar.open('Please select a surgeon to continue', 'Close', { duration: 3000 });
      return;
    }
    
    if (this.currentStep === 2 && !this.selectedImplant) {
      this.snackBar.open('Please select an implant to continue', 'Close', { duration: 3000 });
      return;
    }
    
    if (this.currentStep === 3 && !this.selectedHospitalZone) {
      this.snackBar.open('Please select a hospital to continue', 'Close', { duration: 3000 });
      return;
    }
    
    if (this.currentStep === 4) {
      if (this.patientForm.invalid) {
        this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
        return;
      }
      this.submitJourney();
      return;
    }
    
    this.currentStep++;
  }
  
  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  
  selectSurgery(surgery: Surgery): void {
    this.selectedSurgery = surgery;
  }
  
  selectSurgeon(surgeon: Surgeon): void {
    this.selectedSurgeon = surgeon;
  }
  
  selectImplant(implant: Implant): void {
    this.selectedImplant = implant;
  }
  
  selectHospitalZone(zone: HospitalZone): void {
    this.selectedHospitalZone = zone;
  }
  
  toggleFilter(): void {
    this.filterOpen = !this.filterOpen;
  }
  
  applySurgeryFilters(): void {
    this.filteredSurgeries = this.surgeries.filter(surgery => {
      // Apply type filter
      if (this.surgeryFilters.type && surgery.type !== this.surgeryFilters.type) {
        return false;
      }
      
      // Apply side filter
      if (this.surgeryFilters.side && surgery.side !== this.surgeryFilters.side) {
        return false;
      }
      
      // Apply isTotal filter
      if (this.surgeryFilters.isTotal !== null && surgery.isTotal !== this.surgeryFilters.isTotal) {
        return false;
      }
      
      // Apply isPartial filter
      if (this.surgeryFilters.isPartial !== null && surgery.isPartial !== this.surgeryFilters.isPartial) {
        return false;
      }
      
      // Apply isReplacement filter
      if (this.surgeryFilters.isReplacement !== null && surgery.isReplacement !== this.surgeryFilters.isReplacement) {
        return false;
      }
      
      // Apply isRevision filter
      if (this.surgeryFilters.isRevision !== null && surgery.isRevision !== this.surgeryFilters.isRevision) {
        return false;
      }
      
      // Apply price range filter
      if (this.surgeryFilters.priceRange && 
          (surgery.price < this.surgeryFilters.priceRange[0] || 
           surgery.price > this.surgeryFilters.priceRange[1])) {
        return false;
      }
      
      return true;
    });
  }
  
  applySurgeonFilters(): void {
    this.filteredSurgeons = this.surgeons.filter(surgeon => {
      // Apply specialty filter
      if (this.filters.specialty && surgeon.specialty !== this.filters.specialty) {
        return false;
      }
      
      // Apply experience filter
      if (this.filters.experience && surgeon.experience < this.filters.experience) {
        return false;
      }
      
      // Apply rating filter
      if (this.filters.rating && surgeon.rating < this.filters.rating) {
        return false;
      }
      
      // Apply hospital filter
      if (this.filters.hospital && surgeon.hospital !== this.filters.hospital) {
        return false;
      }
      
      return true;
    });
  }
  
  resetSurgeryFilters(): void {
    this.surgeryFilters = {
      type: null,
      side: null,
      isTotal: null,
      isPartial: null,
      isReplacement: null,
      isRevision: null,
      priceRange: [50000, 250000]
    };
    this.filteredSurgeries = [...this.surgeries];
  }
  
  resetSurgeonFilters(): void {
    this.filters = {
      specialty: null,
      experience: null,
      rating: null,
      hospital: null
    };
    this.filteredSurgeons = [...this.surgeons];
  }
  
  filterImplants(): void {
    if (this.selectedSurgery) {
      this.filteredImplants = this.implants.filter(implant => 
        implant.name.toLowerCase().includes(this.selectedSurgery!.type.toLowerCase()));
    } else {
      this.filteredImplants = [...this.implants];
    }
  }
  
  submitJourney(): void {
    if (this.patientForm.valid && this.selectedSurgery && this.selectedSurgeon && 
        this.selectedImplant && this.selectedHospitalZone) {
      
      const patientData = {
        ...this.patientForm.value,
        surgeryType: this.selectedSurgery.name,
        surgeon: this.selectedSurgeon.name,
        implant: this.selectedImplant.name,
        hospital: this.selectedHospitalZone.name,
        totalCost: this.selectedSurgery.price + this.selectedSurgeon.price + this.selectedImplant.price
      };
      
      // In a real app, this would be sent to an API
      console.log('Submitting patient journey:', patientData);
      
      this.snackBar.open('Your appointment has been scheduled successfully!', 'Close', { duration: 5000 });
      
      // Reset the form and selections
      this.patientForm.reset();
      this.selectedSurgery = null;
      this.selectedSurgeon = null;
      this.selectedImplant = null;
      this.selectedHospitalZone = null;
      this.currentStep = 0;
    }
  }
  
  getStepLabel(step: number): string {
    switch (step) {
      case 0: return 'Select Surgery';
      case 1: return 'Select Surgeon';
      case 2: return 'Select Implant';
      case 3: return 'Select Hospital';
      case 4: return 'Patient Information';
      default: return '';
    }
  }
}
