import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PatientService, Surgery, Surgeon, Implant, HospitalZone } from '../modules/patient/patient.service';

// Declare Leaflet to fix type errors
declare const L: any;

// Define interfaces for filter options
interface SurgeryFilters {
  type: string | null;
  side: string | null;
  isTotal: boolean | null;
  isPartial: boolean | null;
  isReplacement: boolean | null;
  isRevision: boolean | null;
  priceRange: [number, number] | null;
}

interface SurgeonFilters {
  fellowshipType: string | null;
  city: string | null;
  isLocal: boolean | null;
  isVisiting: boolean | null;
  minExperience: number | null;
  minSurgeryCount: number | null;
  offersIndianImplants: boolean | null;
  offersImportedImplants: boolean | null;
  availableNextDays: number | null;
  hasWeekendSlots: boolean | null;
  minRating: number | null;
  hasPublications: boolean | null;
  languages: string[] | null;
}

// Define interface for Zone - making it compatible with HospitalZone
interface Zone extends HospitalZone {
  center?: { lat: number; lng: number };
  radius?: number;
  lat?: number;
  lng?: number;
  location?: { lat: number; lng: number };
}

@Component({
  selector: 'app-patient-journey',
  templateUrl: './patient-journey.component.html',
  styleUrls: ['./patient-journey.component.scss']
})
export class PatientJourneyComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  // Form groups for each step
  step1FormGroup!: FormGroup;
  step2FormGroup!: FormGroup;
  step3FormGroup!: FormGroup;
  step4FormGroup!: FormGroup;
  step5FormGroup!: FormGroup;
  
  // Data arrays
  surgeries: Surgery[] = [];
  filteredSurgeries: Surgery[] = [];
  surgeons: Surgeon[] = [];
  filteredSurgeons: Surgeon[] = [];
  implants: Implant[] = [];
  filteredImplants: Implant[] = [];
  zones: HospitalZone[] = [];
  
  // Filter objects
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
    fellowshipType: null,
    city: null,
    isLocal: null,
    isVisiting: null,
    minExperience: null,
    minSurgeryCount: null,
    offersIndianImplants: null,
    offersImportedImplants: null,
    availableNextDays: null,
    hasWeekendSlots: null,
    minRating: null,
    hasPublications: null,
    languages: null
  };
  
  // Selection tracking
  step1Surgery: string | null = null;
  step2Surgeon: string | null = null;
  step3Implant: string | null = null;
  step4Zone: string | null = null;
  
  // UI state
  showFilterSidebar = false;
  currentStepIndex = 0;
  
  // Filter options
  cities: string[] = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata'];
  languages: string[] = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Punjabi', 'Bengali'];
  
  // Map related properties
  map: any = null;
  mapZones: Zone[] = [];
  selectedZone: Zone | null = null;
  
  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService
  ) {}
  
  ngOnInit(): void {
    // Initialize filtered surgeries
    this.patientService.getSurgeries().subscribe(data => {
      this.surgeries = data;
      this.filteredSurgeries = [...data]; // Initialize with all surgeries
    });
    
    // Load surgeons from service
    this.patientService.getSurgeons().subscribe(data => {
      this.surgeons = data;
      this.filteredSurgeons = [...data]; // Initialize with all surgeons
    });
    
    // Load implants from service
    this.patientService.getImplants().subscribe(data => {
      this.implants = data;
      this.filteredImplants = [...data]; // Initialize with all implants
    });
    
    // Load hospital zones from service
    this.patientService.getHospitalZones().subscribe(data => {
      this.zones = data;
      
      // Convert to map zones
      this.mapZones = data.map(zone => {
        return {
          ...zone,
          center: zone.location || { lat: zone.lat || 0, lng: zone.lng || 0 },
          radius: 500 // Default radius in meters
        };
      });
    });
    
    // Initialize form groups
    this.initFormGroups();
    
    // Load Leaflet scripts
    this.loadLeafletScripts();
  }
  
  ngAfterViewInit(): void {
    // Listen for step changes
    if (this.stepper) {
      this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
        this.currentStepIndex = event.selectedIndex;
        
        // Initialize map when reaching the hospital zone step
        if (event.selectedIndex === 3 && !this.map) {
          setTimeout(() => {
            this.initMap();
          }, 100);
        }
      });
    }
  }
  
  initMap(): void {
    // Check if Leaflet is loaded
    if (typeof L !== 'undefined') {
      // Create map centered on India
      this.map = L.map('map').setView([20.5937, 78.9629], 5);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      
      // Add markers for each zone
      this.mapZones.forEach(zone => {
        const marker = L.marker([zone.center?.lat || 0, zone.center?.lng || 0])
          .addTo(this.map)
          .bindPopup(`<b>${zone.name}</b><br>${zone.description || ''}`);
        
        // Add click handler
        marker.on('click', () => {
          this.selectZone(zone);
        });
        
        // Add circle to represent coverage area
        L.circle([zone.center?.lat || 0, zone.center?.lng || 0], {
          color: zone.color || '#3f51b5',
          fillColor: zone.color || '#3f51b5',
          fillOpacity: 0.2,
          radius: zone.radius || 500
        }).addTo(this.map);
      });
      
      // Fit map to show all markers
      if (this.mapZones.length > 0) {
        const bounds = this.mapZones.map(zone => [zone.center?.lat || 0, zone.center?.lng || 0]);
        this.map.fitBounds(bounds);
      }
    } else {
      console.error('Leaflet not loaded');
    }
  }
  
  loadLeafletScripts(): void {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
    document.head.appendChild(link);
    
    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
    script.onload = () => {
      console.log('Leaflet loaded');
    };
    document.head.appendChild(script);
  }
  
  initFormGroups(): void {
    this.step1FormGroup = this.formBuilder.group({
      surgery: ['', Validators.required]
    });
    
    this.step2FormGroup = this.formBuilder.group({
      surgeon: ['', Validators.required]
    });
    
    this.step3FormGroup = this.formBuilder.group({
      implant: ['', Validators.required]
    });
    
    this.step4FormGroup = this.formBuilder.group({
      zone: ['', Validators.required]
    });
    
    this.step5FormGroup = this.formBuilder.group({
      patientName: ['', Validators.required],
      patientAge: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      patientGender: ['', Validators.required],
      patientContact: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      patientEmail: ['', [Validators.required, Validators.email]],
      patientAddress: ['', Validators.required],
      appointmentDate: ['', Validators.required]
    });
  }
  
  // Surgery selection and filtering
  selectSurgery(surgeryId: string): void {
    this.step1Surgery = surgeryId;
    this.step1FormGroup.get('surgery')?.setValue(surgeryId);
    
    // Enable the next button by making the form valid
    this.step1FormGroup.markAsDirty();
    this.step1FormGroup.updateValueAndValidity();
  }
  
  applySurgeryFilters(): void {
    this.filteredSurgeries = this.surgeries.filter(surgery => {
      // Filter by type (knee or hip)
      const typeMatch = !this.surgeryFilters.type || surgery.type === this.surgeryFilters.type;
      
      // Filter by side (left or right)
      const sideMatch = !this.surgeryFilters.side || surgery.side === this.surgeryFilters.side;
      
      // Filter by surgery characteristics
      const totalMatch = this.surgeryFilters.isTotal === null || surgery.isTotal === this.surgeryFilters.isTotal;
      const partialMatch = this.surgeryFilters.isPartial === null || surgery.isPartial === this.surgeryFilters.isPartial;
      const replacementMatch = this.surgeryFilters.isReplacement === null || surgery.isReplacement === this.surgeryFilters.isReplacement;
      const revisionMatch = this.surgeryFilters.isRevision === null || surgery.isRevision === this.surgeryFilters.isRevision;
      
      // Filter by price range
      const priceMatch = !this.surgeryFilters.priceRange || 
        (surgery.price >= this.surgeryFilters.priceRange[0] && 
         surgery.price <= this.surgeryFilters.priceRange[1]);
      
      return typeMatch && sideMatch && totalMatch && partialMatch && 
             replacementMatch && revisionMatch && priceMatch;
    });
  }
  
  clearAllSurgeryFilters(): void {
    this.surgeryFilters = {
      type: null,
      side: null,
      isTotal: null,
      isPartial: null,
      isReplacement: null,
      isRevision: null,
      priceRange: null
    };
    this.filteredSurgeries = [...this.surgeries];
  }
  
  hasSurgeryFilters(): boolean {
    return (
      this.surgeryFilters.type !== null ||
      this.surgeryFilters.side !== null ||
      this.surgeryFilters.isTotal !== null ||
      this.surgeryFilters.isPartial !== null ||
      this.surgeryFilters.isReplacement !== null ||
      this.surgeryFilters.isRevision !== null ||
      this.surgeryFilters.priceRange !== null
    );
  }
  
  getSurgeryFilterCount(): number {
    let count = 0;
    if (this.surgeryFilters.type !== null) count++;
    if (this.surgeryFilters.side !== null) count++;
    if (this.surgeryFilters.isTotal !== null) count++;
    if (this.surgeryFilters.isPartial !== null) count++;
    if (this.surgeryFilters.isReplacement !== null) count++;
    if (this.surgeryFilters.isRevision !== null) count++;
    if (this.surgeryFilters.priceRange !== null) count++;
    return count;
  }
  
  // Surgeon selection and filtering
  selectSurgeon(surgeonName: string): void {
    this.step2Surgeon = surgeonName;
    this.step2FormGroup.get('surgeon')?.setValue(surgeonName);
    
    // Enable the next button by making the form valid
    this.step2FormGroup.markAsDirty();
    this.step2FormGroup.updateValueAndValidity();
    
    // Filter implants based on selected surgeon
    const selectedSurgeon = this.surgeons.find(s => s.name === surgeonName);
    if (selectedSurgeon) {
      this.filteredImplants = this.implants.filter(implant => {
        // Logic to filter implants based on surgeon preferences
        // For example, if surgeon offers Indian implants, show those
        return true; // Placeholder logic
      });
    }
  }
  
  applyFilters(): void {
    this.filteredSurgeons = this.surgeons.filter(surgeon => {
      // Filter by fellowship type
      const fellowshipMatch = !this.filters.fellowshipType || 
        surgeon.fellowshipType === this.filters.fellowshipType;
      
      // Filter by city
      const cityMatch = !this.filters.city || 
        surgeon.city === this.filters.city;
      
      // Filter by local vs visiting
      const localMatch = this.filters.isLocal === null || 
        surgeon.isLocal === this.filters.isLocal;
      
      const visitingMatch = this.filters.isVisiting === null || 
        surgeon.isVisiting === this.filters.isVisiting;
      
      // Filter by experience
      const experienceMatch = !this.filters.minExperience || 
        (surgeon.experience || surgeon.yearsExperience || 0) >= this.filters.minExperience;
      
      // Filter by surgery count
      const surgeryCountMatch = !this.filters.minSurgeryCount || 
        surgeon.surgeryCount >= this.filters.minSurgeryCount;
      
      // Filter by implant offerings
      const indianImplantsMatch = this.filters.offersIndianImplants === null || 
        surgeon.offersIndianImplants === this.filters.offersIndianImplants;
      
      const importedImplantsMatch = this.filters.offersImportedImplants === null || 
        surgeon.offersImportedImplants === this.filters.offersImportedImplants;
      
      // Filter by availability
      const availabilityMatch = !this.filters.availableNextDays || 
        (surgeon.availableNextDays || surgeon.availableIn || 0) <= this.filters.availableNextDays;
      
      // Filter by weekend slots
      const weekendMatch = this.filters.hasWeekendSlots === null || 
        surgeon.hasWeekendSlots === this.filters.hasWeekendSlots;
      
      // Filter by rating
      const ratingMatch = !this.filters.minRating || 
        surgeon.rating >= this.filters.minRating;
      
      // Filter by publications
      const publicationsMatch = this.filters.hasPublications === null || 
        surgeon.hasPublications === this.filters.hasPublications;
      
      // Filter by languages
      const languagesMatch = !this.filters.languages || this.filters.languages.length === 0 || 
        this.filters.languages.some(lang => surgeon.languages.includes(lang));
      
      return fellowshipMatch && cityMatch && localMatch && visitingMatch && 
             experienceMatch && surgeryCountMatch && indianImplantsMatch && 
             importedImplantsMatch && availabilityMatch && weekendMatch && 
             ratingMatch && publicationsMatch && languagesMatch;
    });
  }
  
  clearAllFilters(): void {
    this.filters = {
      fellowshipType: null,
      city: null,
      isLocal: null,
      isVisiting: null,
      minExperience: null,
      minSurgeryCount: null,
      offersIndianImplants: null,
      offersImportedImplants: null,
      availableNextDays: null,
      hasWeekendSlots: null,
      minRating: null,
      hasPublications: null,
      languages: null
    };
    this.filteredSurgeons = [...this.surgeons];
  }
  
  hasActiveFilters(): boolean {
    return (
      this.filters.fellowshipType !== null ||
      this.filters.city !== null ||
      this.filters.isLocal !== null ||
      this.filters.isVisiting !== null ||
      this.filters.minExperience !== null ||
      this.filters.minSurgeryCount !== null ||
      this.filters.offersIndianImplants !== null ||
      this.filters.offersImportedImplants !== null ||
      this.filters.availableNextDays !== null ||
      this.filters.hasWeekendSlots !== null ||
      this.filters.minRating !== null ||
      this.filters.hasPublications !== null ||
      (this.filters.languages !== null && this.filters.languages.length > 0)
    );
  }
  
  getActiveFilterCount(): number {
    let count = 0;
    if (this.filters.fellowshipType !== null) count++;
    if (this.filters.city !== null) count++;
    if (this.filters.isLocal !== null) count++;
    if (this.filters.isVisiting !== null) count++;
    if (this.filters.minExperience !== null) count++;
    if (this.filters.minSurgeryCount !== null) count++;
    if (this.filters.offersIndianImplants !== null) count++;
    if (this.filters.offersImportedImplants !== null) count++;
    if (this.filters.availableNextDays !== null) count++;
    if (this.filters.hasWeekendSlots !== null) count++;
    if (this.filters.minRating !== null) count++;
    if (this.filters.hasPublications !== null) count++;
    if (this.filters.languages !== null && this.filters.languages.length > 0) count++;
    return count;
  }
  
  // Implant selection
  selectImplant(implantName: string): void {
    this.step3Implant = implantName;
    this.step3FormGroup.get('implant')?.setValue(implantName);
    
    // Enable the next button by making the form valid
    this.step3FormGroup.markAsDirty();
    this.step3FormGroup.updateValueAndValidity();
  }
  
  // Zone selection
  selectZone(zone: HospitalZone): void {
    this.selectedZone = zone;
    this.step4Zone = zone.name;
    this.step4FormGroup.get('zone')?.setValue(zone.name);
    
    // Enable the next button by making the form valid
    this.step4FormGroup.markAsDirty();
    this.step4FormGroup.updateValueAndValidity();
  }
  
  // Handle form submission
  submitJourney(): void {
    if (this.step5FormGroup.valid) {
      // In a real application, you would send this data to a backend service
      const journeyData = {
        surgery: this.step1Surgery,
        surgeon: this.step2Surgeon,
        implant: this.step3Implant,
        zone: this.step4Zone,
        appointment: this.step5FormGroup.value
      };
      
      console.log('Journey data submitted:', journeyData);
      alert('Your appointment request has been submitted successfully! Our team will contact you shortly to confirm your appointment.');
      
      // Reset the form and navigate back to the first step
      this.resetJourney();
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.step5FormGroup.controls).forEach(key => {
        const control = this.step5FormGroup.get(key);
        control?.markAsTouched();
      });
    }
  }
  
  resetJourney(): void {
    // Reset all form groups
    this.step1FormGroup.reset();
    this.step2FormGroup.reset();
    this.step3FormGroup.reset();
    this.step4FormGroup.reset();
    this.step5FormGroup.reset();
    
    // Reset selection tracking
    this.step1Surgery = null;
    this.step2Surgeon = null;
    this.step3Implant = null;
    this.step4Zone = null;
    
    // Reset filters
    this.clearAllSurgeryFilters();
    this.clearAllFilters();
    
    // Navigate back to the first step
    if (this.stepper) {
      this.stepper.reset();
    }
  }
  
  toggleFilterSidebar(): void {
    // Toggle sidebar based on current step
    this.showFilterSidebar = !this.showFilterSidebar;
    
    // On mobile, when sidebar is open, prevent body scrolling
    if (window.innerWidth <= 768) {
      if (this.showFilterSidebar) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }
}
