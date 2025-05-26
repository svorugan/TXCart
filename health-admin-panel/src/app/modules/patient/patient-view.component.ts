import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { PatientService, Surgery, Surgeon, Implant, HospitalZone } from './patient.service';

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
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.scss']
})
export class PatientViewComponent implements OnInit, AfterViewInit {
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
    priceRange: null
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
      const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Default center (Delhi)
      this.mapZones = data.map(zone => {
        return {
          id: zone.id,
          name: zone.name,
          description: (zone as any).description || 'Hospital Zone',
          color: (zone as any).color || '#3f51b5',
          center: (zone as any).location || defaultCenter,
          radius: 2000 // Default radius in meters
        };
      });
    });
    
    // Initialize with filter sidebar hidden
    this.showFilterSidebar = false;
    this.currentStepIndex = 0; // Start at first step
    
    // Initialize form groups
    this.initFormGroups();
  }
  
  // This is a duplicate method that will be removed

  ngAfterViewInit(): void {
    // Set up stepper event listener
    if (this.stepper) {
      this.stepper.selectionChange.subscribe((event: StepperSelectionEvent) => {
        this.currentStepIndex = event.selectedIndex;
        
        // Show filter sidebar automatically when on Select Surgeon step (index 1)
        if (this.currentStepIndex === 1) {
          // Force the filter sidebar to be visible when on the surgeon selection step
          setTimeout(() => {
            this.showFilterSidebar = true;
          }, 100); // Short delay to ensure DOM is updated
        }
        
        // Initialize map when on the Hospital selection step (index 3)
        if (this.currentStepIndex === 3 && !this.map) {
          setTimeout(() => this.initMap(), 100); // Short delay to ensure DOM is ready
        }
        
        // Update the URL to reflect the current step (for bookmarking/sharing)
        history.replaceState({}, '', `#step=${this.currentStepIndex + 1}`);
      });
    }
  }
  
  initMap(): void {
    try {
      // Check if Leaflet is available
      if (typeof L === 'undefined') {
        this.loadLeafletScripts();
        return;
      }
      
      // Initialize the map
      const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi
      this.map = L.map('hospital-map').setView([defaultCenter.lat, defaultCenter.lng], 11);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      
      // Add zones as circles
      this.mapZones.forEach(zone => {
        // Skip zones without center coordinates
        if (!zone.center) {
          // Use location property if available, or default to lat/lng properties
          if (zone.location) {
            zone.center = zone.location;
          } else if (zone.lat && zone.lng) {
            zone.center = { lat: zone.lat, lng: zone.lng };
          } else {
            console.warn(`Zone ${zone.name} has no coordinates, skipping`); 
            return;
          }
        }
        
        // Use default radius if not specified
        const radius = zone.radius || 1000; // Default 1km radius
        
        const circle = L.circle([zone.center.lat, zone.center.lng], {
          color: zone.color || '#3f51b5',
          fillColor: zone.color || '#3f51b5',
          fillOpacity: 0.2,
          radius: radius
        }).addTo(this.map);
        
        // Add popup with zone information
        circle.bindPopup(`<b>${zone.name}</b><br>${zone.description}`);
        
        // Add click handler
        circle.on('click', () => {
          this.selectZone(zone);
        });
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }
  
  loadLeafletScripts(): void {
    // Create link element for Leaflet CSS
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(linkElement);
    
    // Create script element for Leaflet JS
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    scriptElement.onload = () => {
      // Initialize map once Leaflet is loaded
      setTimeout(() => this.initMap(), 100);
    };
    document.body.appendChild(scriptElement);
  }
  
  initFormGroups(): void {
    this.step1FormGroup = this.formBuilder.group({
      surgeryType: ['', Validators.required]
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
      appointmentDate: ['', Validators.required],
      patientName: ['', Validators.required],
      patientAge: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      patientGender: ['', Validators.required],
      patientContact: ['', Validators.required],
      patientEmail: ['', [Validators.required, Validators.email]],
      patientAddress: ['', Validators.required]
    });
  }
  
  // Surgery selection and filtering
  selectSurgery(surgeryId: string): void {
    this.step1Surgery = surgeryId;
    this.step1FormGroup.get('surgeryType')?.setValue(surgeryId);
    
    // Enable the next button by making the form valid
    this.step1FormGroup.markAsDirty();
    this.step1FormGroup.updateValueAndValidity();
  }
  
  applySurgeryFilters(): void {
    this.filteredSurgeries = this.surgeries.filter(surgery => {
      // Type filter
      if (this.surgeryFilters.type !== null && surgery.type !== this.surgeryFilters.type) {
        return false;
      }
      
      // Side filter
      if (this.surgeryFilters.side !== null && surgery.side !== this.surgeryFilters.side) {
        return false;
      }
      
      // Total/Partial filter
      if (this.surgeryFilters.isTotal !== null && surgery.isTotal !== this.surgeryFilters.isTotal) {
        return false;
      }
      
      if (this.surgeryFilters.isPartial !== null && surgery.isPartial !== this.surgeryFilters.isPartial) {
        return false;
      }
      
      // Replacement/Revision filter
      if (this.surgeryFilters.isReplacement !== null && surgery.isReplacement !== this.surgeryFilters.isReplacement) {
        return false;
      }
      
      if (this.surgeryFilters.isRevision !== null && surgery.isRevision !== this.surgeryFilters.isRevision) {
        return false;
      }
      
      // Price range filter
      if (this.surgeryFilters.priceRange !== null) {
        const [min, max] = this.surgeryFilters.priceRange;
        if (surgery.price < min || surgery.price > max) {
          return false;
        }
      }
      
      return true;
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
    
    console.log('Surgeon selected:', surgeonName);
    console.log('step2Surgeon set to:', this.step2Surgeon);
    console.log('Form valid:', this.step2FormGroup.valid);
    
    // Scroll to the bottom to make the Continue button visible
    setTimeout(() => {
      const actionButtons = document.querySelector('.action-buttons');
      if (actionButtons) {
        actionButtons.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  }
  
  applyFilters(): void {
    this.filteredSurgeons = this.surgeons.filter(surgeon => {
      // Fellowship type filter
      if (this.filters.fellowshipType !== null && surgeon.fellowshipType !== this.filters.fellowshipType) {
        return false;
      }
      
      // City filter
      if (this.filters.city !== null && surgeon.city !== this.filters.city) {
        return false;
      }
      
      // Local/Visiting filter
      if (this.filters.isLocal !== null && surgeon.isLocal !== this.filters.isLocal) {
        return false;
      }
      
      if (this.filters.isVisiting !== null && surgeon.isVisiting !== this.filters.isVisiting) {
        return false;
      }
      
      // Experience filter
      if (this.filters.minExperience !== null) {
        const experience = surgeon.yearsExperience || surgeon.experience || 0;
        if (experience < this.filters.minExperience) {
          return false;
        }
      }
      
      // Surgery count filter
      if (this.filters.minSurgeryCount !== null && surgeon.surgeryCount < this.filters.minSurgeryCount) {
        return false;
      }
      
      // Implant options filter
      if (this.filters.offersIndianImplants !== null && surgeon.offersIndianImplants !== this.filters.offersIndianImplants) {
        return false;
      }
      
      if (this.filters.offersImportedImplants !== null && surgeon.offersImportedImplants !== this.filters.offersImportedImplants) {
        return false;
      }
      
      // Availability filter
      if (this.filters.availableNextDays !== null) {
        const availableDays = surgeon.availableNextDays || surgeon.availableIn || 0;
        if (availableDays > this.filters.availableNextDays) {
          return false;
        }
      }
      
      // Weekend slots filter
      if (this.filters.hasWeekendSlots !== null && surgeon.hasWeekendSlots !== this.filters.hasWeekendSlots) {
        return false;
      }
      
      // Rating filter
      if (this.filters.minRating !== null && surgeon.rating < this.filters.minRating) {
        return false;
      }
      
      // Publications filter
      if (this.filters.hasPublications !== null && surgeon.hasPublications !== this.filters.hasPublications) {
        return false;
      }
      
      // Languages filter
      if (this.filters.languages !== null && this.filters.languages.length > 0) {
        // Check if surgeon speaks all selected languages
        const speaksAllLanguages = this.filters.languages.every(language => 
          surgeon.languages.includes(language)
        );
        if (!speaksAllLanguages) {
          return false;
        }
      }
      
      return true;
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
      alert('Patient journey created successfully!');
      
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
