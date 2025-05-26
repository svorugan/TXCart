import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientService, Surgeon, Implant, HospitalZone } from './patient.service';

declare const L: any; // Declare Leaflet library

interface Zone {
  id: string;
  name: string;
  description: string;
  color: string;
  center: [number, number];
  radius: number;
}

@Component({
  selector: 'app-patient-view',
  standalone: true,
  imports: [
    MatStepperModule,
    MatCardModule,
    MatButtonModule,
    MatRadioModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.scss']
})
export class PatientViewComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  // Form groups for stepper
  step1FormGroup: FormGroup;
  step2FormGroup: FormGroup;
  step3FormGroup: FormGroup;
  step4FormGroup: FormGroup;
  
  // Step selections
  step1Selection = '';
  step2Surgeon = '';
  step3Implant = '';
  step4Zone = '';
  
  // Surgery data
  surgeries: any[] = [
    {
      id: 'left-tkr',
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
      image: 'assets/images/left-tkr.jpg'
    },
    {
      id: 'right-tkr',
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
      image: 'assets/images/right-tkr.jpg'
    },
    {
      id: 'partial-left',
      name: 'Partial Knee Replacement (Left)',
      description: 'Partial replacement of the left knee joint',
      recoveryTime: '3-4 weeks',
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
      id: 'partial-right',
      name: 'Partial Knee Replacement (Right)',
      description: 'Partial replacement of the right knee joint',
      recoveryTime: '3-4 weeks',
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
      id: 'left-hip',
      name: 'Total Hip Replacement (Left)',
      description: 'Complete replacement of the left hip joint',
      recoveryTime: '4-6 weeks',
      painLevel: 'Moderate to Severe',
      successRate: '96%',
      type: 'hip',
      side: 'left',
      isTotal: true,
      isPartial: false,
      isReplacement: true,
      isRevision: false,
      price: 180000,
      image: 'assets/images/left-hip.jpg'
    },
    {
      id: 'right-hip',
      name: 'Total Hip Replacement (Right)',
      description: 'Complete replacement of the right hip joint',
      recoveryTime: '4-6 weeks',
      painLevel: 'Moderate to Severe',
      successRate: '96%',
      type: 'hip',
      side: 'right',
      isTotal: true,
      isPartial: false,
      isReplacement: true,
      isRevision: false,
      price: 180000,
      image: 'assets/images/right-hip.jpg'
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
  
  filteredSurgeries: any[] = [];
  
  // Surgery filters
  surgeryFilters = {
    type: null as string | null,
    side: null as string | null,
    isTotal: null as boolean | null,
    isPartial: null as boolean | null,
    isReplacement: null as boolean | null,
    isRevision: null as boolean | null,
    maxPrice: null as number | null
  };
  
  // Cost tracking
  implantCost = 0;
  estimate = 160000;
  
  // User info
  userName = 'Sridhar';
  
  // Data from service
  surgeons: Surgeon[] = [];
  filteredSurgeons: Surgeon[] = [];
  implants: Implant[] = [];
  filteredImplants: Implant[] = [];
  zones: HospitalZone[] = [];
  availableZones: Zone[] = [];
  selectedZone?: Zone;
  
  // Map instance
  map: any;
  
  // Sidebar state
  showFilterSidebar = false; // Hidden by default, will be shown only on Select Surgeons step
  currentStepIndex = 0; // Track the current step index
  
  // Filter options
  cities: string[] = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 
    'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal'
  ];
  
  languages: string[] = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi', 
    'Bengali', 'Gujarati', 'Punjabi', 'Urdu'
  ];
  
  // Surgeon filters
  filters = {
    minExperience: null as number | null,
    fellowshipType: null as string | null,
    city: null as string | null,
    isLocal: false,
    isVisiting: false,
    availableNextDays: null as number | null,
    hasWeekendSlots: false,
    minSurgeryCount: null as number | null,
    offersIndianImplants: false,
    offersImportedImplants: false,
    minRating: null as number | null,
    hasPublications: false,
    languages: [] as string[]
  };
  
  constructor(private fb: FormBuilder, private patientService: PatientService) {
    // Initialize form groups
    this.step1FormGroup = this.fb.group({
      surgeryType: ['', Validators.required]
    });
    
    this.step2FormGroup = this.fb.group({
      surgeon: ['', Validators.required]
    });
    
    this.step3FormGroup = this.fb.group({
      implant: ['', Validators.required]
    });
    
    this.step4FormGroup = this.fb.group({
      zone: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Initialize filtered surgeries
    this.filteredSurgeries = [...this.surgeries];
    
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
      
      // Convert to Zone interface
      this.availableZones = data.map(zone => {
        // Create a default center location if not available
        const defaultCenter: [number, number] = [19.05, 72.85]; // Default coordinates
        
        return {
          id: zone.id.toString(),
          name: zone.name,
          // Use optional chaining and nullish coalescing for properties that might not exist
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
      
      // Initialize the map if the container exists
      const mapElement = document.getElementById('map');
      if (mapElement && !this.map) {
        // Mumbai coordinates as center
        const centerCoordinates: [number, number] = [19.076, 72.877];
        
        // Create the map
        this.map = L.map('map').setView(centerCoordinates, 11);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // Add zone circles to the map
        this.availableZones.forEach(zone => {
          const circle = L.circle(zone.center, {
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: 0.2,
            radius: zone.radius
          }).addTo(this.map);
          
          // Add click event to select zone
          circle.on('click', () => {
            this.selectZone(zone);
          });
          
          // Add a marker at the center of each zone
          const marker = L.marker(zone.center, {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: ${zone.color}; width: 12px; height: 12px; border-radius: 50%;"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })
          }).addTo(this.map);
          
          // Add tooltip with zone name
          marker.bindTooltip(zone.name);
          
          // Add click event to marker
          marker.on('click', () => {
            this.selectZone(zone);
          });
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }
  
  private loadLeafletScripts(): void {
    // Add Leaflet CSS if not already added
    if (!document.getElementById('leaflet-css')) {
      const leafletCss = document.createElement('link');
      leafletCss.id = 'leaflet-css';
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      leafletCss.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      leafletCss.crossOrigin = '';
      document.head.appendChild(leafletCss);
    }
    
    // Add Leaflet JS if not already added
    if (!document.getElementById('leaflet-script')) {
      const leafletScript = document.createElement('script');
      leafletScript.id = 'leaflet-script';
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletScript.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      leafletScript.crossOrigin = '';
      document.body.appendChild(leafletScript);
      
      // Initialize map once Leaflet is loaded
      leafletScript.onload = () => {
        setTimeout(() => this.initMap(), 100);
      };
    }
  }
  
  // Filter methods
  hasActiveFilters(): boolean {
    return Object.values(this.filters).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== false;
    });
  }
  
  hasSurgeryFilters(): boolean {
    return Object.values(this.surgeryFilters).some(value => {
      return value !== null && value !== false;
    });
  }
  
  getActiveFilterCount(): number {
    return Object.values(this.filters).filter(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== false;
    }).length;
  }
  
  getSurgeryFilterCount(): number {
    return Object.values(this.surgeryFilters).filter(value => {
      return value !== null && value !== false;
    }).length;
  }
  
  applySurgeryFilters(): void {
    // Apply all active filters to the surgeries list
    this.filteredSurgeries = this.surgeries.filter(surgery => {
      // Type filter
      if (this.surgeryFilters.type !== null && surgery.type !== this.surgeryFilters.type) {
        return false;
      }
      
      // Side filter
      if (this.surgeryFilters.side !== null && surgery.side !== this.surgeryFilters.side) {
        return false;
      }
      
      // Total replacement filter
      if (this.surgeryFilters.isTotal !== null && surgery.isTotal !== this.surgeryFilters.isTotal) {
        return false;
      }
      
      // Partial replacement filter
      if (this.surgeryFilters.isPartial !== null && surgery.isPartial !== this.surgeryFilters.isPartial) {
        return false;
      }
      
      // Replacement filter
      if (this.surgeryFilters.isReplacement !== null && surgery.isReplacement !== this.surgeryFilters.isReplacement) {
        return false;
      }
      
      // Revision filter
      if (this.surgeryFilters.isRevision !== null && surgery.isRevision !== this.surgeryFilters.isRevision) {
        return false;
      }
      
      // Price filter
      if (this.surgeryFilters.maxPrice !== null && surgery.price > this.surgeryFilters.maxPrice) {
        return false;
      }
      
      return true;
    });
  }
  
  clearSurgeryFilter(filterName: string): void {
    switch (filterName) {
      case 'type':
        this.surgeryFilters.type = null;
        break;
      case 'side':
        this.surgeryFilters.side = null;
        break;
      case 'isTotal':
        this.surgeryFilters.isTotal = null;
        break;
      case 'isPartial':
        this.surgeryFilters.isPartial = null;
        break;
      case 'isReplacement':
        this.surgeryFilters.isReplacement = null;
        break;
      case 'isRevision':
        this.surgeryFilters.isRevision = null;
        break;
      case 'maxPrice':
        this.surgeryFilters.maxPrice = null;
        break;
    }
    this.applySurgeryFilters();
  }
  
  clearAllSurgeryFilters(): void {
    this.surgeryFilters = {
      type: null,
      side: null,
      isTotal: null,
      isPartial: null,
      isReplacement: null,
      isRevision: null,
      maxPrice: null
    };
    this.applySurgeryFilters();
  }
  
  selectSurgery(id: string): void {
    // Update the displayed surgery selection
    this.step1Selection = id;
    
    // Update the form control value to enable the Continue button
    this.step1FormGroup.get('surgeryType')?.setValue(id);
    
    // Find the selected surgery to update the estimate
    const selectedSurgery = this.surgeries.find(surgery => surgery.id === id);
    if (selectedSurgery) {
      // Update base estimate with surgery price
      this.estimate = selectedSurgery.price + this.implantCost;
    }
  }
  
  viewDoctorDetails(surgeon: Surgeon): void {
    // Open a dialog or navigate to a detailed view
    console.log('Viewing details for:', surgeon);
    // Implement dialog or detailed view navigation
  }
  
  applyFilters(): void {
    // Apply all active filters to the surgeons list
    this.filteredSurgeons = this.surgeons.filter(surgeon => {
      // Experience filter
      if (this.filters.minExperience !== null && surgeon.yearsExperience && 
          surgeon.yearsExperience < this.filters.minExperience) {
        return false;
      }
      
      // Fellowship type filter
      if (this.filters.fellowshipType !== null && surgeon.fellowshipType !== this.filters.fellowshipType) {
        return false;
      }
      
      // City filter
      if (this.filters.city !== null && surgeon.city !== this.filters.city) {
        return false;
      }
      
      // Local doctor filter
      if (this.filters.isLocal && !surgeon.isLocal) {
        return false;
      }
      
      // Visiting doctor filter
      if (this.filters.isVisiting && !surgeon.isVisiting) {
        return false;
      }
      
      // Available within days filter
      if (this.filters.availableNextDays !== null && surgeon.availableNextDays && 
          surgeon.availableNextDays > this.filters.availableNextDays) {
        return false;
      }
      
      // Weekend slots filter
      if (this.filters.hasWeekendSlots && !surgeon.hasWeekendSlots) {
        return false;
      }
      
      // Surgery count filter
      if (this.filters.minSurgeryCount !== null && surgeon.surgeryCount && 
          surgeon.surgeryCount < this.filters.minSurgeryCount) {
        return false;
      }
      
      // Indian implants filter
      if (this.filters.offersIndianImplants && !surgeon.offersIndianImplants) {
        return false;
      }
      
      // Imported implants filter
      if (this.filters.offersImportedImplants && !surgeon.offersImportedImplants) {
        return false;
      }
      
      // Rating filter
      if (this.filters.minRating !== null && surgeon.rating && 
          surgeon.rating < this.filters.minRating) {
        return false;
      }
      
      // Publications filter
      if (this.filters.hasPublications && !surgeon.hasPublications) {
        return false;
      }
      
      // Languages filter
      if (this.filters.languages.length > 0 && surgeon.languages) {
        // Check if surgeon speaks at least one of the selected languages
        const hasLanguage = this.filters.languages.some(lang => 
          surgeon.languages && surgeon.languages.includes(lang)
        );
        if (!hasLanguage) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  clearFilter(filterName: string): void {
    switch (filterName) {
      case 'minExperience':
        this.filters.minExperience = null;
        break;
      case 'fellowshipType':
        this.filters.fellowshipType = null;
        break;
      case 'city':
        this.filters.city = null;
        break;
      case 'isLocal':
        this.filters.isLocal = false;
        break;
      case 'isVisiting':
        this.filters.isVisiting = false;
        break;
      case 'availableNextDays':
        this.filters.availableNextDays = null;
        break;
      case 'hasWeekendSlots':
        this.filters.hasWeekendSlots = false;
        break;
      case 'minSurgeryCount':
        this.filters.minSurgeryCount = null;
        break;
      case 'offersIndianImplants':
        this.filters.offersIndianImplants = false;
        break;
      case 'offersImportedImplants':
        this.filters.offersImportedImplants = false;
        break;
      case 'minRating':
        this.filters.minRating = null;
        break;
      case 'hasPublications':
        this.filters.hasPublications = false;
        break;
      case 'languages':
        this.filters.languages = [];
        break;
    }
    this.applyFilters();
  }
  
  clearAllFilters(): void {
    this.filters = {
      minExperience: null,
      fellowshipType: null,
      city: null,
      isLocal: false,
      isVisiting: false,
      availableNextDays: null,
      hasWeekendSlots: false,
      minSurgeryCount: null,
      offersIndianImplants: false,
      offersImportedImplants: false,
      minRating: null,
      hasPublications: false,
      languages: []
    };
    this.applyFilters();
  }
  
  toggleFilterSidebar(): void {
    // Only toggle sidebar on Select Surgeons step (index 1)
    if (this.currentStepIndex === 1) {
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
  
  selectZone(zone: Zone | string): void {
    if (typeof zone === 'string') {
      // If a string ID is passed, find the corresponding zone
      const foundZone = this.availableZones.find(z => z.id.toLowerCase() === zone.toLowerCase());
      if (foundZone) {
        this.selectedZone = foundZone;
        this.step4Zone = foundZone.name;
      } else {
        // If no matching zone is found, just set the zone name
        this.step4Zone = zone.toString();
      }
    } else {
      // If a Zone object is passed
      this.selectedZone = zone;
      this.step4Zone = zone.name;
    }
    
    // Update the form control value
    this.step4FormGroup.get('zone')?.setValue(this.step4Zone);
  }
  
  selectSurgeon(name: string): void {
    // Update the displayed surgeon name
    this.step2Surgeon = name;
    
    // Update the form control value to enable the Continue button
    this.step2FormGroup.get('surgeon')?.setValue(name);
  }
  
  selectImplant(type: string): void {
    this.step3Implant = type;
    
    // Set cost based on implant type
    if (type === 'indian') {
      this.implantCost = 35000;
    } else if (type === 'imported') {
      this.implantCost = 75000;
    }
    
    // Update the estimate
    this.updateEstimate();
    
    // Update the form control value to enable the Continue button
    this.step3FormGroup.get('implant')?.setValue(type);
  }
  
  updateEstimate(): void {
    // Base cost for surgery
    const baseCost = 100000;
    
    // Add implant cost
    this.estimate = baseCost + this.implantCost;
  }
  
  viewImplantDetails(type: string): void {
    // Open a dialog or navigate to a detailed view for implant
    console.log('Viewing details for implant type:', type);
    // Implement dialog or detailed view navigation
  }
  
  bookAppointment(): void {
    // Prepare summary text for the appointment
    const summaryText = `
      Surgery: ${this.step1Selection}
      Surgeon: ${this.step2Surgeon}
      Implant: ${this.step3Implant}
      Zone: ${this.step4Zone}
      Estimated Cost: ₹${this.estimate.toLocaleString()}
    `;
    
    // In a real app, this would open a calendar for scheduling
    alert('Booking appointment with the following details:\n' + summaryText + '\n\nIn a real app, this would open a calendar for scheduling.');
  }
}