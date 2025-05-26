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
import { HospitalService, Hospital } from '../../hospital.service';

@Component({
  selector: 'app-hospital-form',
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
  template: `<div class="hospital-form-container">
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ isEditMode ? 'Edit Hospital Profile' : 'Create New Hospital Profile' }}</mat-card-title>
        <mat-card-subtitle>Enter hospital details including all filter criteria for patient search</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <form [formGroup]="hospitalForm" (ngSubmit)="onSubmit()">
          <mat-tab-group>
            <!-- Basic Information Tab -->
            <mat-tab label="Basic Information">
              <div class="tab-content">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Hospital Name</mat-label>
                    <input matInput formControlName="name" required>
                    <mat-error *ngIf="hospitalForm.get('name')?.hasError('required')">Name is required</mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Tier</mat-label>
                    <mat-select formControlName="tier" required>
                      <mat-option *ngFor="let tier of tiers" [value]="tier">{{ tier }}</mat-option>
                    </mat-select>
                    <mat-error *ngIf="hospitalForm.get('tier')?.hasError('required')">Tier is required</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Zone</mat-label>
                    <mat-select formControlName="zone">
                      <mat-option *ngFor="let zone of zones" [value]="zone">{{ zone }}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>State</mat-label>
                    <mat-select formControlName="state" required>
                      <mat-option *ngFor="let state of states" [value]="state">{{ state }}</mat-option>
                    </mat-select>
                    <mat-error *ngIf="hospitalForm.get('state')?.hasError('required')">State is required</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>City</mat-label>
                    <mat-select formControlName="city" required>
                      <mat-option *ngFor="let city of cities" [value]="city">{{ city }}</mat-option>
                    </mat-select>
                    <mat-error *ngIf="hospitalForm.get('city')?.hasError('required')">City is required</mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Address</mat-label>
                    <textarea matInput formControlName="address" rows="2"></textarea>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Location</mat-label>
                    <input matInput formControlName="location" required>
                    <mat-error *ngIf="hospitalForm.get('location')?.hasError('required')">Location is required</mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Contact Phone</mat-label>
                    <input matInput formControlName="contactPhone">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Contact Email</mat-label>
                    <input matInput formControlName="contactEmail" type="email">
                    <mat-error *ngIf="hospitalForm.get('contactEmail')?.hasError('email')">Please enter a valid email address</mat-error>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Website</mat-label>
                    <input matInput formControlName="website">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Image URL</mat-label>
                    <input matInput formControlName="imageUrl">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Description</mat-label>
                    <textarea matInput formControlName="description" rows="4"></textarea>
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>

            <!-- Rooms & Facilities Tab -->
            <mat-tab label="Rooms & Facilities">
              <div class="tab-content">
                <h3>Room Categories</h3>
                <div class="form-row">
                  <div class="array-container">
                    <div *ngFor="let room of roomCategoriesArray.controls; let i = index" class="array-item">
                      <mat-form-field appearance="outline">
                        <mat-label>Room Category {{ i + 1 }}</mat-label>
                        <mat-select [formControl]="$any(room)">
                          <mat-option *ngFor="let category of roomCategoryOptions" [value]="category">{{ category }}</mat-option>
                        </mat-select>
                      </mat-form-field>
                      <button type="button" mat-icon-button color="warn" (click)="removeRoomCategory(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button type="button" mat-stroked-button color="primary" (click)="addRoomCategory()">
                      <mat-icon>add</mat-icon> Add Room Category
                    </button>
                  </div>
                </div>

                <h3>ICU & OT</h3>
                <div class="form-row checkbox-row">
                  <mat-checkbox formControlName="hasICU">Has In-House ICU</mat-checkbox>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>OT Type</mat-label>
                    <mat-select formControlName="otType">
                      <mat-option *ngFor="let type of otTypes" [value]="type">{{ type }}</mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Recovery Room Type</mat-label>
                    <mat-select formControlName="recoveryRoomType">
                      <mat-option *ngFor="let type of recoveryRoomTypes" [value]="type">{{ type }}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <h3>Amenities</h3>
                <div class="form-row">
                  <div class="array-container">
                    <div *ngFor="let amenity of amenitiesArray.controls; let i = index" class="array-item">
                      <mat-form-field appearance="outline">
                        <mat-label>Amenity {{ i + 1 }}</mat-label>
                        <mat-select [formControl]="$any(amenity)">
                          <mat-option *ngFor="let option of amenityOptions" [value]="option">{{ option }}</mat-option>
                        </mat-select>
                      </mat-form-field>
                      <button type="button" mat-icon-button color="warn" (click)="removeAmenity(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button type="button" mat-stroked-button color="primary" (click)="addAmenity()">
                      <mat-icon>add</mat-icon> Add Amenity
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Surgery & Implants Tab -->
            <mat-tab label="Surgery & Implants">
              <div class="tab-content">
                <h3>Surgery Volume</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Surgery Volume (per year)</mat-label>
                    <input matInput formControlName="surgeryVolume" type="number">
                  </mat-form-field>
                </div>

                <h3>Implant Types</h3>
                <div class="form-row">
                  <div class="array-container">
                    <div *ngFor="let implant of implantTypesArray.controls; let i = index" class="array-item">
                      <mat-form-field appearance="outline">
                        <mat-label>Implant Type {{ i + 1 }}</mat-label>
                        <mat-select [formControl]="$any(implant)">
                          <mat-option *ngFor="let type of implantTypeOptions" [value]="type">{{ type }}</mat-option>
                        </mat-select>
                      </mat-form-field>
                      <button type="button" mat-icon-button color="warn" (click)="removeImplantType(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button type="button" mat-stroked-button color="primary" (click)="addImplantType()">
                      <mat-icon>add</mat-icon> Add Implant Type
                    </button>
                  </div>
                </div>

                <div class="form-row checkbox-row">
                  <mat-checkbox formControlName="allowsExternalSurgeons">Allows External Surgeons</mat-checkbox>
                </div>
              </div>
            </mat-tab>

            <!-- Accreditation & Insurance Tab -->
            <mat-tab label="Accreditation & Insurance">
              <div class="tab-content">
                <h3>Accreditation</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Accreditation</mat-label>
                    <mat-select formControlName="accreditation">
                      <mat-option *ngFor="let acc of accreditationOptions" [value]="acc">{{ acc }}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <h3>Insurance Tie-ups</h3>
                <div class="form-row">
                  <div class="array-container">
                    <div *ngFor="let tieup of insuranceTieupsArray.controls; let i = index" class="array-item">
                      <mat-form-field appearance="outline">
                        <mat-label>Insurance Tie-up {{ i + 1 }}</mat-label>
                        <mat-select [formControl]="$any(tieup)">
                          <mat-option *ngFor="let option of insuranceTieupOptions" [value]="option">{{ option }}</mat-option>
                        </mat-select>
                      </mat-form-field>
                      <button type="button" mat-icon-button color="warn" (click)="removeInsuranceTieup(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </div>
                    <button type="button" mat-stroked-button color="primary" (click)="addInsuranceTieup()">
                      <mat-icon>add</mat-icon> Add Insurance Tie-up
                    </button>
                  </div>
                </div>
              </div>
            </mat-tab>

            <!-- Pricing & Distance Tab -->
            <mat-tab label="Pricing & Distance">
              <div class="tab-content">
                <h3>Pricing</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Pricing Band</mat-label>
                    <mat-select formControlName="pricingBand">
                      <mat-option *ngFor="let band of pricingBands" [value]="band">{{ band }}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <h3>Distance</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Distance (km)</mat-label>
                    <input matInput formControlName="distance" type="number">
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Distance Category</mat-label>
                    <mat-select formControlName="distanceCategory">
                      <mat-option *ngFor="let category of distanceCategories" [value]="category">{{ category }}</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>

            <!-- Ratings Tab -->
            <mat-tab label="Ratings">
              <div class="tab-content">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Rating (0-5)</mat-label>
                    <input matInput formControlName="rating" type="number" min="0" max="5" step="0.1" required>
                    <mat-error *ngIf="hospitalForm.get('rating')?.hasError('required')">Rating is required</mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Review Count</mat-label>
                    <input matInput formControlName="reviewCount" type="number">
                  </mat-form-field>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>

          <div class="form-actions">
            <button type="button" mat-stroked-button (click)="onCancel()">Cancel</button>
            <button type="submit" mat-raised-button color="primary" [disabled]="hospitalForm.invalid || loading">
              {{ isEditMode ? 'Update' : 'Create' }} Hospital
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  </div>`,
  styles: [`
    .hospital-form-container {
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
    }
  `]
})
export class HospitalFormComponent implements OnInit {
  hospitalForm: FormGroup;
  isEditMode = false;
  hospitalId: number | null = null;
  formSubmitted = false;
  loading = false;

  // Reference data
  tiers: string[] = ['Tier 1', 'Tier 2', 'Tier 3'];
  zones: string[] = ['A+', 'A', 'B', 'C'];
  states: string[] = [
    'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Telangana', 'Gujarat', 'West Bengal', 
    'Uttar Pradesh', 'Rajasthan', 'Kerala', 'Punjab', 'Bihar', 'Odisha', 'Assam', 
    'Chhattisgarh', 'Haryana', 'Jharkhand', 'Goa', 'Himachal Pradesh'
  ];
  cities: string[] = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 
    'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 
    'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Coimbatore'
  ];
  roomCategoryOptions: string[] = ['Shared', 'Private', 'Suite'];
  otTypes: string[] = ['Modular', 'Laminar Flow', 'Basic'];
  recoveryRoomTypes: string[] = ['HDU', 'Private Ward', 'Day Care only'];
  amenityOptions: string[] = ['Parking', 'Attender bed', 'Pharmacy', 'Lab onsite'];
  implantTypeOptions: string[] = ['Indian', 'Imported', 'Both'];
  accreditationOptions: string[] = ['NABH', 'ISO', 'Non-accredited'];
  insuranceTieupOptions: string[] = ['CGHS', 'Aarogyasri', 'Private TPA'];
  distanceCategories: string[] = ['0-5 km', '5-10 km', '10-20 km'];
  pricingBands: string[] = ['< ₹50K', '₹50K-1L', '₹1L-2L', '₹2L+'];

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.hospitalForm = this.createHospitalForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.hospitalId = +id;
        this.isEditMode = true;
        this.loadHospital(this.hospitalId);
      }
    });
  }

  createHospitalForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      tier: ['', [Validators.required]],
      location: ['', [Validators.required]],
      address: [''],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zone: [''],
      roomCategories: this.fb.array([]),
      accreditation: [''],
      insuranceTieups: this.fb.array([]),
      hasICU: [false],
      surgeryVolume: [null],
      distance: [null],
      distanceCategory: [''],
      implantTypes: this.fb.array([]),
      otType: [''],
      recoveryRoomType: [''],
      allowsExternalSurgeons: [false],
      amenities: this.fb.array([]),
      pricingBand: [''],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      reviewCount: [0],
      imageUrl: [''],
      contactPhone: [''],
      contactEmail: ['', [Validators.email]],
      website: [''],
      description: ['']
    });
  }

  // Form array getters
  get roomCategoriesArray(): FormArray {
    return this.hospitalForm.get('roomCategories') as FormArray;
  }

  get insuranceTieupsArray(): FormArray {
    return this.hospitalForm.get('insuranceTieups') as FormArray;
  }

  get implantTypesArray(): FormArray {
    return this.hospitalForm.get('implantTypes') as FormArray;
  }

  get amenitiesArray(): FormArray {
    return this.hospitalForm.get('amenities') as FormArray;
  }

  // Add/remove methods for form arrays
  addRoomCategory(): void {
    this.roomCategoriesArray.push(this.fb.control(''));
  }

  removeRoomCategory(index: number): void {
    this.roomCategoriesArray.removeAt(index);
  }

  addInsuranceTieup(): void {
    this.insuranceTieupsArray.push(this.fb.control(''));
  }

  removeInsuranceTieup(index: number): void {
    this.insuranceTieupsArray.removeAt(index);
  }

  addImplantType(): void {
    this.implantTypesArray.push(this.fb.control(''));
  }

  removeImplantType(index: number): void {
    this.implantTypesArray.removeAt(index);
  }

  addAmenity(): void {
    this.amenitiesArray.push(this.fb.control(''));
  }

  removeAmenity(index: number): void {
    this.amenitiesArray.removeAt(index);
  }

  loadHospital(id: number): void {
    this.loading = true;
    this.hospitalService.getHospital(id).subscribe({
      next: (hospital) => {
        // Reset form arrays before populating
        while (this.roomCategoriesArray.length) {
          this.roomCategoriesArray.removeAt(0);
        }
        while (this.insuranceTieupsArray.length) {
          this.insuranceTieupsArray.removeAt(0);
        }
        while (this.implantTypesArray.length) {
          this.implantTypesArray.removeAt(0);
        }
        while (this.amenitiesArray.length) {
          this.amenitiesArray.removeAt(0);
        }

        // Populate form with hospital data
        this.hospitalForm.patchValue({
          name: hospital.name,
          tier: hospital.tier,
          location: hospital.location,
          address: hospital.address,
          city: hospital.city,
          state: hospital.state,
          zone: hospital.zone,
          accreditation: hospital.accreditation,
          hasICU: hospital.hasICU,
          surgeryVolume: hospital.surgeryVolume,
          distance: hospital.distance,
          distanceCategory: hospital.distanceCategory,
          otType: hospital.otType,
          recoveryRoomType: hospital.recoveryRoomType,
          allowsExternalSurgeons: hospital.allowsExternalSurgeons,
          pricingBand: hospital.pricingBand,
          rating: hospital.rating,
          reviewCount: hospital.reviewCount,
          imageUrl: hospital.imageUrl,
          contactPhone: hospital.contactPhone,
          contactEmail: hospital.contactEmail,
          website: hospital.website,
          description: hospital.description
        });

        // Populate arrays
        if (hospital.roomCategories) {
          hospital.roomCategories.forEach(category => {
            this.roomCategoriesArray.push(this.fb.control(category));
          });
        }

        if (hospital.insuranceTieups) {
          hospital.insuranceTieups.forEach(tieup => {
            this.insuranceTieupsArray.push(this.fb.control(tieup));
          });
        }

        if (hospital.implantTypes) {
          hospital.implantTypes.forEach(type => {
            this.implantTypesArray.push(this.fb.control(type));
          });
        }

        if (hospital.amenities) {
          hospital.amenities.forEach(amenity => {
            this.amenitiesArray.push(this.fb.control(amenity));
          });
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hospital:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.hospitalForm.invalid) {
      return;
    }
    
    this.loading = true;
    const hospitalData: Hospital = this.hospitalForm.value;
    
    if (this.isEditMode && this.hospitalId) {
      hospitalData.id = this.hospitalId;
      this.hospitalService.updateHospital(hospitalData).subscribe({
        next: () => {
          this.router.navigate(['/hospitals']);
        },
        error: (error) => {
          console.error('Error updating hospital:', error);
          this.loading = false;
        }
      });
    } else {
      this.hospitalService.createHospital(hospitalData).subscribe({
        next: () => {
          this.router.navigate(['/hospitals']);
        },
        error: (error) => {
          console.error('Error creating hospital:', error);
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/hospitals']);
  }
}
