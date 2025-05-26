import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { DoctorService, Doctor } from '../../doctor.service';

@Component({
  selector: 'app-doctor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatExpansionModule,
    MatTabsModule,
    MatStepperModule
  ],
  template: `<div class="doctor-form-container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ isEditMode ? 'Edit Doctor Profile' : 'Create New Doctor Profile' }}</mat-card-title>
        <mat-card-subtitle>Enter doctor details including all filter criteria for patient search</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="doctorForm" (ngSubmit)="onSubmit()">
          <mat-tab-group>
            <!-- Basic Information Tab -->
            <mat-tab label="Basic Information">
              <div class="tab-content">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Doctor Name</mat-label>
                    <input matInput formControlName="name" required>
                    <mat-error *ngIf="doctorForm.get('name')?.hasError('required')">Name is required</mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Specialty</mat-label>
                    <mat-select formControlName="specialty" required>
                      <mat-option *ngFor="let specialty of specialties" [value]="specialty">{{ specialty }}</mat-option>
                    </mat-select>
                    <mat-error *ngIf="doctorForm.get('specialty')?.hasError('required')">Specialty is required</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Gender</mat-label>
                    <mat-select formControlName="gender">
                      <mat-option *ngFor="let gender of genderOptions" [value]="gender">{{ gender }}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" type="email">
                    <mat-error *ngIf="doctorForm.get('email')?.hasError('email')">Please enter a valid email address</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Phone</mat-label>
                    <input matInput formControlName="phone">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Profile Image URL</mat-label>
                    <input matInput formControlName="imageUrl">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Bio</mat-label>
                    <textarea matInput formControlName="bio" rows="4"></textarea>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Consultation Cost (₹)</mat-label>
                    <input matInput formControlName="cost" type="number">
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>

            <!-- Experience Tab -->
            <mat-tab label="Experience & Fellowship">
              <div class="tab-content">
                <h3>Experience</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Years of Experience</mat-label>
                    <input matInput formControlName="yearsExperience" type="number">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Post-Fellowship Years</mat-label>
                    <input matInput formControlName="postFellowshipYears" type="number">
                  </mat-form-field>
                </div>

                <h3>Fellowship</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Fellowship Type</mat-label>
                    <mat-select formControlName="fellowshipType">
                      <mat-option *ngFor="let type of fellowshipTypes" [value]="type">{{ type }}</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Fellowship Details</mat-label>
                    <input matInput formControlName="fellowshipDetails" placeholder="DNB, FNB, country names, etc.">
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>

            <!-- Location Tab -->
            <mat-tab label="Location">
              <div class="tab-content">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>State</mat-label>
                    <mat-select formControlName="state">
                      <mat-option *ngFor="let state of states" [value]="state">{{ state }}</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>City</mat-label>
                    <mat-select formControlName="city">
                      <mat-option *ngFor="let city of cities[doctorForm.get('state')?.value] || []" [value]="city">{{ city }}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="form-row checkbox-row">
                  <mat-checkbox formControlName="isLocal">Local Doctor</mat-checkbox>
                  <mat-checkbox formControlName="isVisiting">Visiting Doctor</mat-checkbox>
                </div>

                <div *ngIf="doctorForm.get('isVisiting')?.value" class="form-row">
                  <h4>Visiting Cities</h4>
                  <div class="array-container">
                    <div *ngFor="let city of visitingCitiesArray.controls; let i = index" class="array-item">
                      <mat-form-field appearance="outline">
                        <mat-label>City {{ i + 1 }}</mat-label>
                        <input matInput [formControl]="$any(city)">
                      </mat-form-field>
                      <button type="button" mat-icon-button color="warn" (click)="removeVisitingCity(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button type="button" mat-stroked-button color="primary" (click)="addVisitingCity()">
                      <mat-icon>add</mat-icon> Add Visiting City
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Availability Tab -->
            <mat-tab label="Availability">
              <div class="tab-content">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Available Next Days</mat-label>
                    <input matInput formControlName="availableNextDays" type="number">
                  </mat-form-field>
                </div>

                <div class="form-row checkbox-row">
                  <mat-checkbox formControlName="hasWeekendSlots">Has Weekend Slots</mat-checkbox>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Availability Notes</mat-label>
                    <textarea matInput formControlName="availabilityNotes" rows="3"></textarea>
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>

            <!-- Surgery & Implants Tab -->
            <mat-tab label="Surgery & Implants">
              <div class="tab-content">
                <h3>Surgery Volume</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Surgery Count</mat-label>
                    <input matInput formControlName="surgeryCount" type="number">
                  </mat-form-field>

                  <div class="checkbox-container">
                    <mat-checkbox formControlName="verifiedSurgeryCount">Verified Surgery Count</mat-checkbox>
                  </div>
                </div>

                <div class="form-row">
                  <h4>Surgery Types</h4>
                  <div class="array-container">
                    <div *ngFor="let type of surgeryTypesArray.controls; let i = index" class="array-item">
                      <mat-form-field appearance="outline">
                        <mat-label>Surgery Type {{ i + 1 }}</mat-label>
                        <input matInput [formControl]="$any(type)">
                      </mat-form-field>
                      <button type="button" mat-icon-button color="warn" (click)="removeSurgeryType(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button type="button" mat-stroked-button color="primary" (click)="addSurgeryType()">
                      <mat-icon>add</mat-icon> Add Surgery Type
                    </button>
                  </div>
                </div>

                <h3>Implant Preferences</h3>
                <div class="form-row checkbox-row">
                  <mat-checkbox formControlName="offersIndianImplants">Offers Indian Implants</mat-checkbox>
                  <mat-checkbox formControlName="offersImportedImplants">Offers Imported Implants</mat-checkbox>
                </div>

                <div class="form-row">
                  <h4>Implant Preferences</h4>
                  <div class="array-container">
                    <div *ngFor="let pref of implantPreferencesArray.controls; let i = index" class="array-item">
                      <mat-form-field appearance="outline">
                        <mat-label>Implant {{ i + 1 }}</mat-label>
                        <input matInput [formControl]="$any(pref)">
                      </mat-form-field>
                      <button type="button" mat-icon-button color="warn" (click)="removeImplantPreference(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button type="button" mat-stroked-button color="primary" (click)="addImplantPreference()">
                      <mat-icon>add</mat-icon> Add Implant Preference
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Ratings & Academic Tab -->
            <mat-tab label="Ratings & Academic">
              <div class="tab-content">
                <h3>Ratings & Reviews</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Patient Rating (0-5)</mat-label>
                    <input matInput formControlName="patientRating" type="number" min="0" max="5" step="0.1">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Review Count</mat-label>
                    <input matInput formControlName="reviewCount" type="number">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <h4>External Ratings</h4>
                  <div class="array-container">
                    <div *ngFor="let rating of externalRatingsArray.controls; let i = index" class="array-item">
                      <div [formGroup]="$any(rating)" class="rating-group">
                        <mat-form-field appearance="outline">
                          <mat-label>Source</mat-label>
                          <input matInput formControlName="source" placeholder="Google, Practo, etc.">
                        </mat-form-field>
                        <mat-form-field appearance="outline">
                          <mat-label>Rating</mat-label>
                          <input matInput formControlName="rating" type="number" min="0" max="5" step="0.1">
                        </mat-form-field>
                        <mat-form-field appearance="outline">
                          <mat-label>Link</mat-label>
                          <input matInput formControlName="link" placeholder="URL to rating">
                        </mat-form-field>
                        <button type="button" mat-icon-button color="warn" (click)="removeExternalRating(i)">
                          <mat-icon>delete</mat-icon>
                        </button>
                      </div>
                    </div>
                    <button type="button" mat-stroked-button color="primary" (click)="addExternalRating()">
                      <mat-icon>add</mat-icon> Add External Rating
                    </button>
                  </div>
                </div>

                <h3>Academic Merit</h3>
                <div class="form-row checkbox-row">
                  <mat-checkbox formControlName="hasPublications">Has Publications</mat-checkbox>
                  <mat-checkbox formControlName="isSpeaker">Speaker at Events</mat-checkbox>
                </div>

                <div *ngIf="doctorForm.get('hasPublications')?.value" class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Publication Count</mat-label>
                    <input matInput formControlName="publicationCount" type="number">
                  </mat-form-field>
                </div>

                <div *ngIf="doctorForm.get('isSpeaker')?.value" class="form-row">
                  <h4>Speaker Events</h4>
                  <div class="array-container">
                    <div *ngFor="let event of speakerEventsArray.controls; let i = index" class="array-item">
                      <mat-form-field appearance="outline">
                        <mat-label>Event {{ i + 1 }}</mat-label>
                        <input matInput [formControl]="$any(event)">
                      </mat-form-field>
                      <button type="button" mat-icon-button color="warn" (click)="removeSpeakerEvent(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button type="button" mat-stroked-button color="primary" (click)="addSpeakerEvent()">
                      <mat-icon>add</mat-icon> Add Speaker Event
                    </button>
                  </div>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Academic Notes</mat-label>
                    <textarea matInput formControlName="academicNotes" rows="3"></textarea>
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>

            <!-- Languages Tab -->
            <mat-tab label="Languages">
              <div class="tab-content">
                <div class="form-row">
                  <h4>Languages Spoken</h4>
                  <div class="array-container">
                    <div *ngFor="let lang of languagesArray.controls; let i = index" class="array-item">
                      <mat-form-field appearance="outline">
                        <mat-label>Language {{ i + 1 }}</mat-label>
                        <mat-select [formControl]="$any(lang)">
                          <mat-option *ngFor="let language of languages" [value]="language">{{ language }}</mat-option>
                        </mat-select>
                      </mat-form-field>
                      <button type="button" mat-icon-button color="warn" (click)="removeLanguage(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button type="button" mat-stroked-button color="primary" (click)="addLanguage()">
                      <mat-icon>add</mat-icon> Add Language
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>

          <div class="form-actions">
            <button type="button" mat-stroked-button (click)="onCancel()">Cancel</button>
            <button type="submit" mat-raised-button color="primary" [disabled]="doctorForm.invalid || loading">
              {{ isEditMode ? 'Update' : 'Create' }} Doctor
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  </div>`,
  styles: [`
    .doctor-form-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    mat-card {
      margin-bottom: 20px;
    }
    
    mat-card-header {
      margin-bottom: 20px;
    }
    
    mat-card-title {
      font-size: 24px;
      font-weight: 500;
    }
    
    mat-card-subtitle {
      font-size: 16px;
      color: #666;
    }
    
    .tab-content {
      padding: 20px 0;
    }
    
    .form-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .half-width {
      flex: 1;
      min-width: 200px;
    }
    
    .checkbox-row {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      height: 60px; /* Align with mat-form-field height */
    }
    
    h3 {
      font-size: 18px;
      font-weight: 500;
      margin: 20px 0 10px 0;
      color: #333;
      border-bottom: 1px solid #eee;
      padding-bottom: 8px;
    }
    
    h4 {
      font-size: 16px;
      font-weight: 500;
      margin: 10px 0;
      color: #555;
    }
    
    .array-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }
    
    .array-item {
      display: flex;
      align-items: center;
      gap: 10px;
      
      mat-form-field {
        flex: 1;
      }
    }
    
    .rating-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      width: 100%;
      
      mat-form-field {
        flex: 1;
        min-width: 150px;
      }
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .half-width {
        width: 100%;
      }
      
      .rating-group {
        flex-direction: column;
      }
    }
  `]
})
export class DoctorFormComponent implements OnInit {
  doctorForm: FormGroup;
  isEditMode = false;
  doctorId: number | null = null;
  formSubmitted = false;
  loading = false;
  
  // Dropdown options
  specialties: string[] = [
    'Orthopedics',
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'General Surgery',
    'ENT',
    'Dermatology',
    'Ophthalmology',
    'Gynecology',
    'Urology'
  ];
  
  states: string[] = [
    'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Maharashtra',
    'Delhi', 'West Bengal', 'Gujarat', 'Punjab', 'Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh',
    'Bihar', 'Odisha', 'Assam', 'Chhattisgarh', 'Haryana', 'Jharkhand', 'Goa', 'Himachal Pradesh'
  ];
  
  cities: { [state: string]: string[] } = {
    'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Khammam'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik']
  };
  
  fellowshipTypes = ['National', 'International', 'Multiple'];
  
  languages: string[] = [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 
    'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Urdu'
  ];
  
  genderOptions = ['Male', 'Female', 'Other'];
  
  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.doctorForm = this.createDoctorForm();
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.doctorId = +params['id'];
        this.loadDoctorData(this.doctorId);
      }
    });
  }
  
  createDoctorForm(): FormGroup {
    return this.fb.group({
      // Basic Information
      name: ['', [Validators.required]],
      specialty: ['', [Validators.required]],
      gender: [''],
      imageUrl: [''],
      bio: [''],
      email: ['', [Validators.email]],
      phone: [''],
      
      // Experience
      yearsExperience: [0],
      postFellowshipYears: [0],
      
      // Fellowship
      fellowshipType: [''],
      fellowshipDetails: [''],
      
      // Location
      state: [''],
      city: [''],
      isLocal: [false],
      isVisiting: [false],
      visitingCities: this.fb.array([]),
      
      // Availability
      availableNextDays: [0],
      hasWeekendSlots: [false],
      availabilityNotes: [''],
      
      // Surgery Volume
      surgeryCount: [0],
      surgeryTypes: this.fb.array([]),
      verifiedSurgeryCount: [false],
      
      // Implant Preference
      offersIndianImplants: [false],
      offersImportedImplants: [false],
      implantPreferences: this.fb.array([]),
      
      // Ratings & Reviews
      patientRating: [0],
      reviewCount: [0],
      externalRatings: this.fb.array([]),
      
      // Academic Merit
      hasPublications: [false],
      publicationCount: [0],
      isSpeaker: [false],
      speakerEvents: this.fb.array([]),
      academicNotes: [''],
      
      // Languages
      languages: this.fb.array([]),
      
      // Cost
      cost: [0]
    });
  }
  
  // Helper methods for form arrays
  get visitingCitiesArray() {
    return this.doctorForm.get('visitingCities') as FormArray;
  }
  
  get surgeryTypesArray() {
    return this.doctorForm.get('surgeryTypes') as FormArray;
  }
  
  get implantPreferencesArray() {
    return this.doctorForm.get('implantPreferences') as FormArray;
  }
  
  get externalRatingsArray() {
    return this.doctorForm.get('externalRatings') as FormArray;
  }
  
  get speakerEventsArray() {
    return this.doctorForm.get('speakerEvents') as FormArray;
  }
  
  get languagesArray() {
    return this.doctorForm.get('languages') as FormArray;
  }
  
  // Add methods for form arrays
  addVisitingCity() {
    this.visitingCitiesArray.push(this.fb.control(''));
  }
  
  addSurgeryType() {
    this.surgeryTypesArray.push(this.fb.control(''));
  }
  
  addImplantPreference() {
    this.implantPreferencesArray.push(this.fb.control(''));
  }
  
  addExternalRating() {
    this.externalRatingsArray.push(
      this.fb.group({
        source: [''],
        rating: [0],
        link: ['']
      })
    );
  }
  
  addSpeakerEvent() {
    this.speakerEventsArray.push(this.fb.control(''));
  }
  
  addLanguage() {
    this.languagesArray.push(this.fb.control(''));
  }
  
  // Remove methods for form arrays
  removeVisitingCity(index: number) {
    this.visitingCitiesArray.removeAt(index);
  }
  
  removeSurgeryType(index: number) {
    this.surgeryTypesArray.removeAt(index);
  }
  
  removeImplantPreference(index: number) {
    this.implantPreferencesArray.removeAt(index);
  }
  
  removeExternalRating(index: number) {
    this.externalRatingsArray.removeAt(index);
  }
  
  removeSpeakerEvent(index: number) {
    this.speakerEventsArray.removeAt(index);
  }
  
  removeLanguage(index: number) {
    this.languagesArray.removeAt(index);
  }
  
  // Load doctor data for editing
  loadDoctorData(id: number) {
    this.loading = true;
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        const doctor = doctors.find(d => d.id === id);
        if (doctor) {
          this.populateForm(doctor);
        } else {
          this.router.navigate(['/doctors']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading doctor data', error);
        this.loading = false;
      }
    });
  }
  
  // Populate form with doctor data
  populateForm(doctor: Doctor) {
    // Reset form arrays first
    while (this.visitingCitiesArray.length) {
      this.visitingCitiesArray.removeAt(0);
    }
    while (this.surgeryTypesArray.length) {
      this.surgeryTypesArray.removeAt(0);
    }
    while (this.implantPreferencesArray.length) {
      this.implantPreferencesArray.removeAt(0);
    }
    while (this.externalRatingsArray.length) {
      this.externalRatingsArray.removeAt(0);
    }
    while (this.speakerEventsArray.length) {
      this.speakerEventsArray.removeAt(0);
    }
    while (this.languagesArray.length) {
      this.languagesArray.removeAt(0);
    }
    
    // Set basic form values
    this.doctorForm.patchValue({
      name: doctor.name,
      specialty: doctor.specialty,
      gender: doctor.gender,
      imageUrl: doctor.imageUrl,
      bio: doctor.bio,
      email: doctor.email,
      phone: doctor.phone,
      yearsExperience: doctor.yearsExperience,
      postFellowshipYears: doctor.postFellowshipYears,
      fellowshipType: doctor.fellowshipType,
      fellowshipDetails: doctor.fellowshipDetails,
      state: doctor.state,
      city: doctor.city,
      isLocal: doctor.isLocal,
      isVisiting: doctor.isVisiting,
      availableNextDays: doctor.availableNextDays,
      hasWeekendSlots: doctor.hasWeekendSlots,
      availabilityNotes: doctor.availabilityNotes,
      surgeryCount: doctor.surgeryCount,
      verifiedSurgeryCount: doctor.verifiedSurgeryCount,
      offersIndianImplants: doctor.offersIndianImplants,
      offersImportedImplants: doctor.offersImportedImplants,
      patientRating: doctor.patientRating,
      reviewCount: doctor.reviewCount,
      hasPublications: doctor.hasPublications,
      publicationCount: doctor.publicationCount,
      isSpeaker: doctor.isSpeaker,
      academicNotes: doctor.academicNotes,
      cost: doctor.cost
    });
    
    // Add array values
    if (doctor.visitingCities) {
      doctor.visitingCities.forEach(city => {
        this.visitingCitiesArray.push(this.fb.control(city));
      });
    }
    
    if (doctor.surgeryTypes) {
      doctor.surgeryTypes.forEach(type => {
        this.surgeryTypesArray.push(this.fb.control(type));
      });
    }
    
    if (doctor.implantPreferences) {
      doctor.implantPreferences.forEach(pref => {
        this.implantPreferencesArray.push(this.fb.control(pref));
      });
    }
    
    if (doctor.externalRatings) {
      doctor.externalRatings.forEach(rating => {
        this.externalRatingsArray.push(
          this.fb.group({
            source: [rating.source],
            rating: [rating.rating],
            link: [rating.link || '']
          })
        );
      });
    }
    
    if (doctor.speakerEvents) {
      doctor.speakerEvents.forEach(event => {
        this.speakerEventsArray.push(this.fb.control(event));
      });
    }
    
    if (doctor.languages) {
      doctor.languages.forEach(lang => {
        this.languagesArray.push(this.fb.control(lang));
      });
    }
  }
  
  // Submit form
  onSubmit() {
    this.formSubmitted = true;
    
    if (this.doctorForm.invalid) {
      return;
    }
    
    const doctorData = this.prepareDoctorData();
    this.loading = true;
    
    if (this.isEditMode && this.doctorId) {
      doctorData.id = this.doctorId;
      this.doctorService.updateDoctor(doctorData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/doctors']);
        },
        error: (error) => {
          console.error('Error updating doctor', error);
          this.loading = false;
        }
      });
    } else {
      this.doctorService.createDoctor(doctorData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/doctors']);
        },
        error: (error) => {
          console.error('Error creating doctor', error);
          this.loading = false;
        }
      });
    }
  }
  
  // Prepare doctor data from form
  prepareDoctorData(): Doctor {
    const formValue = this.doctorForm.value;
    
    return {
      id: this.doctorId || 0,
      name: formValue.name,
      specialty: formValue.specialty,
      gender: formValue.gender,
      imageUrl: formValue.imageUrl,
      bio: formValue.bio,
      email: formValue.email,
      phone: formValue.phone,
      yearsExperience: formValue.yearsExperience,
      postFellowshipYears: formValue.postFellowshipYears,
      fellowshipType: formValue.fellowshipType,
      fellowshipDetails: formValue.fellowshipDetails,
      state: formValue.state,
      city: formValue.city,
      isLocal: formValue.isLocal,
      isVisiting: formValue.isVisiting,
      visitingCities: formValue.visitingCities,
      availableNextDays: formValue.availableNextDays,
      hasWeekendSlots: formValue.hasWeekendSlots,
      availabilityNotes: formValue.availabilityNotes,
      surgeryCount: formValue.surgeryCount,
      surgeryTypes: formValue.surgeryTypes,
      verifiedSurgeryCount: formValue.verifiedSurgeryCount,
      offersIndianImplants: formValue.offersIndianImplants,
      offersImportedImplants: formValue.offersImportedImplants,
      implantPreferences: formValue.implantPreferences,
      patientRating: formValue.patientRating,
      reviewCount: formValue.reviewCount,
      externalRatings: formValue.externalRatings,
      hasPublications: formValue.hasPublications,
      publicationCount: formValue.publicationCount,
      isSpeaker: formValue.isSpeaker,
      speakerEvents: formValue.speakerEvents,
      academicNotes: formValue.academicNotes,
      languages: formValue.languages,
      cost: formValue.cost
    };
  }
  
  // Cancel form
  onCancel() {
    this.router.navigate(['/doctors']);
  }
}
