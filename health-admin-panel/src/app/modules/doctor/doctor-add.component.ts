import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctor } from './doctor.model';
import { DoctorService } from './doctor.service';

@Component({
  selector: 'app-doctor-add',
  templateUrl: './doctor-add.component.html',
  styleUrls: ['./doctor-add.component.scss']
})
export class DoctorAddComponent implements OnInit {
  asFormControl(ctrl: AbstractControl | null): FormControl {
    return ctrl as FormControl;
  }


  // --- File upload handlers ---
  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      // Store the file object for form submission
      this.form.patchValue({ photoFile: file });
      
      // Create a URL for display in the UI
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        this.form.patchValue({ photo: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  }

  onQualificationProofSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const qualifications = this.qualificationsControls;
      if (qualifications[index]) {
        qualifications[index].patchValue({ proof: file });
      }
    }
  }

  onRegistrationProofSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.form.patchValue({ registrationProof: file });
    }
  }

  form: FormGroup;
  isSubmitting = false;
  isEditMode = false;
  doctorId: string | null = null;
  pageTitle = 'Add Doctor';

  constructor(
    private fb: FormBuilder, 
    private doctorService: DoctorService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      // Tab 1: Basic Information
      name: ['', Validators.required],
      photo: [null], // for display (data URL)
      photoFile: [null], // actual file object for upload
      city: ['', Validators.required],
      specialty: ['', Validators.required],
      qualifications: this.fb.array([this.fb.group({
        degree: [''],
        institution: [''],
        year: [''],
        proof: [null] // file upload
      })]),
      experience: ['', [Validators.required, Validators.min(0)]],
      languagesSpoken: [''],
      gender: ['', Validators.required],
      
      // Tab 2: Professional Details
      medicalLicenseNo: [''],
      registrationCouncil: [''],
      registrationYear: [''],
      registrationProof: [null], // file upload
      hospitalAffiliations: this.fb.array([this.fb.control('')]),
      clinicName: [''],
      clinicLocation: [''],
      workingHours: [''],
      telehealth: [false],
      fellowshipType: ['', Validators.required], // Legacy field
      locationBase: ['', Validators.required], // Legacy field
      availability: ['', Validators.required], // Legacy field
      
      // Tab 3: Expertise & Services
      areasOfExpertise: this.fb.array([this.fb.control('')]),
      patientServices: this.fb.array([this.fb.control('')]),
      surgeryVolume: [''], // Legacy field
      implantPreference: [''], // Legacy field
      
      // Tab 4: Booking & Contact
      consultationFee: [''],
      appointmentOptions: this.fb.array([this.fb.control('')]),
      locationMap: [''],
      email: [''],
      phone: [''],

      // Identity Proof
      identityProofType: [''],
      identityProofFiles: this.fb.array([]), // array for multiple uploads

      // Establishment
      establishmentType: ['', Validators.required],
      
      // Tab 5: About & Reviews
      about: [''],
      ratings: [''],
      reviewCount: [''],
      patientComments: this.fb.array([this.fb.control('')]),
      externalRatings: [''], // Legacy field
      academicMerit: [''], // Legacy field
      
      // Tab 6: Certifications & Background
      certifications: this.fb.array([this.fb.control('')]),
      affiliations: this.fb.array([this.fb.control('')]),
      publications: this.fb.array([this.fb.control('')]),
      education: this.fb.array([this.fb.control('')]), // Legacy field
      experienceDetails: [''], // Legacy field
      previousSurgeries: this.fb.array([this.fb.control('')]), // Legacy field
      surgeriesInPast: this.fb.array([this.fb.control('')]), // Legacy field
      preferredImplants: this.fb.array([this.fb.control('')]) // Legacy field
    });
  }

  // Basic Information
  get qualifications() { return this.form.get('qualifications') as FormArray; }
  get qualificationsControls() { return this.qualifications.controls as FormGroup[]; }

  // Identity Proof
  get identityProofFiles() { return this.form.get('identityProofFiles') as FormArray; }

  // Professional Details
  get hospitalAffiliations() { return this.form.get('hospitalAffiliations') as FormArray; }
  get hospitalAffiliationsControls(): FormControl[] { return this.hospitalAffiliations.controls as FormControl[]; }

  // Expertise & Services
  get areasOfExpertise() { return this.form.get('areasOfExpertise') as FormArray; }
  get areasOfExpertiseControls(): FormControl[] { return this.areasOfExpertise.controls as FormControl[]; }

  get patientServices() { return this.form.get('patientServices') as FormArray; }
  get patientServicesControls(): FormControl[] { return this.patientServices.controls as FormControl[]; }

  // Booking & Contact
  get appointmentOptions() { return this.form.get('appointmentOptions') as FormArray; }
  get appointmentOptionsControls(): FormControl[] { return this.appointmentOptions.controls as FormControl[]; }

  // About & Reviews
  get patientComments() { return this.form.get('patientComments') as FormArray; }
  get patientCommentsControls(): FormControl[] { return this.patientComments.controls as FormControl[]; }

  // Certifications & Background
  get certifications() { return this.form.get('certifications') as FormArray; }
  get certificationsControls(): FormControl[] { return this.certifications.controls as FormControl[]; }

  get affiliations() { return this.form.get('affiliations') as FormArray; }
  get affiliationsControls(): FormControl[] { return this.affiliations.controls as FormControl[]; }

  get publications() { return this.form.get('publications') as FormArray; }
  get publicationsControls(): FormControl[] { return this.publications.controls as FormControl[]; }

  // Legacy getters
  get education() { return this.form.get('education') as FormArray; }
  get educationControls(): FormControl[] { return this.education.controls as FormControl[]; }

  get previousSurgeries() { return this.form.get('previousSurgeries') as FormArray; }
  get previousSurgeriesControls(): FormControl[] { return this.previousSurgeries.controls as FormControl[]; }

  get surgeriesInPast() { return this.form.get('surgeriesInPast') as FormArray; }
  get surgeriesInPastControls(): FormControl[] { return this.surgeriesInPast.controls as FormControl[]; }

  get preferredImplants() { return this.form.get('preferredImplants') as FormArray; }
  get preferredImplantsControls(): FormControl[] { return this.preferredImplants.controls as FormControl[]; }

  addItem(array: FormArray) { array.push(this.fb.control('')); }
  removeItem(array: FormArray, idx: number) { if (array.length > 1) array.removeAt(idx); }

  ngOnInit() {
    // Check if we're in edit mode by looking for an ID in the route
    this.route.paramMap.subscribe(params => {
      this.doctorId = params.get('id');
      if (this.doctorId) {
        this.isEditMode = true;
        this.pageTitle = 'Edit Doctor';
        this.loadDoctorData(this.doctorId);
      }
    });
  }

  loadDoctorData(id: string) {
    this.doctorService.getDoctor(id).subscribe((doctor: Doctor) => {
      if (doctor) {
        // Prepare form arrays before patching values
        this.prepareFormArrays(doctor);
        
        // Convert arrays to strings for the form
        const formData: any = { ...doctor };
        if (formData.languagesSpoken && Array.isArray(formData.languagesSpoken)) {
          formData.languagesSpoken = formData.languagesSpoken.join(', ');
        }
        
        // Make sure all optional arrays are defined
        if (!doctor.qualifications) doctor.qualifications = [];
        if (!doctor.hospitalAffiliations) doctor.hospitalAffiliations = [];
        if (!doctor.areasOfExpertise) doctor.areasOfExpertise = [];
        if (!doctor.patientServices) doctor.patientServices = [];
        if (!doctor.appointmentOptions) doctor.appointmentOptions = [];
        if (!doctor.patientComments) doctor.patientComments = [];
        if (!doctor.certifications) doctor.certifications = [];
        if (!doctor.affiliations) doctor.affiliations = [];
        if (!doctor.publications) doctor.publications = [];
        if (!doctor.education) doctor.education = [];
        if (!doctor.previousSurgeries) doctor.previousSurgeries = [];
        if (!doctor.surgeriesInPast) doctor.surgeriesInPast = [];
        if (!doctor.preferredImplants) doctor.preferredImplants = [];
        
        // Patch the form with doctor data
        this.form.patchValue(formData);
      }
    });
  }

  prepareFormArrays(doctor: Doctor) {
    // Reset and prepare all form arrays to match the doctor data
    this.prepareArray(this.qualifications, doctor.qualifications);
    this.prepareArray(this.hospitalAffiliations, doctor.hospitalAffiliations);
    this.prepareArray(this.areasOfExpertise, doctor.areasOfExpertise);
    this.prepareArray(this.patientServices, doctor.patientServices);
    this.prepareArray(this.appointmentOptions, doctor.appointmentOptions);
    this.prepareArray(this.patientComments, doctor.patientComments);
    this.prepareArray(this.certifications, doctor.certifications);
    this.prepareArray(this.affiliations, doctor.affiliations);
    this.prepareArray(this.publications, doctor.publications);
    this.prepareArray(this.education, doctor.education);
    this.prepareArray(this.previousSurgeries, doctor.previousSurgeries);
    this.prepareArray(this.surgeriesInPast, doctor.surgeriesInPast);
    this.prepareArray(this.preferredImplants, doctor.preferredImplants);
  }

  prepareArray(formArray: FormArray, values?: string[]) {
    // Clear the form array
    while (formArray.length) {
      formArray.removeAt(0);
    }
    
    // If there are values, add them to the form array
    if (values && values.length) {
      values.forEach(value => {
        formArray.push(this.fb.control(value));
      });
    } else {
      // Add at least one empty control
      formArray.push(this.fb.control(''));
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const value = {...this.form.value};
    
    // Use the photoFile for submission if available
    if (value.photoFile) {
      value.photo = value.photoFile;
    }
    delete value.photoFile; // Remove the temporary field
    
    // Process string arrays from comma-separated inputs
    value.languagesSpoken = value.languagesSpoken ? value.languagesSpoken.split(',').map((s: string) => s.trim()) : [];
    
    // Process form arrays
    // Basic Information
    value.qualifications = this.qualifications.controls.map(c => c.value).filter((v: string) => v && v.trim());
    
    // Professional Details
    value.hospitalAffiliations = this.hospitalAffiliations.controls.map(c => c.value).filter((v: string) => v && v.trim());
    
    // Expertise & Services
    value.areasOfExpertise = this.areasOfExpertise.controls.map(c => c.value).filter((v: string) => v && v.trim());
    value.patientServices = this.patientServices.controls.map(c => c.value).filter((v: string) => v && v.trim());
    
    // Booking & Contact
    value.appointmentOptions = this.appointmentOptions.controls.map(c => c.value).filter((v: string) => v && v.trim());
    
    // About & Reviews
    value.patientComments = this.patientComments.controls.map(c => c.value).filter((v: string) => v && v.trim());
    
    // Certifications & Background
    value.certifications = this.certifications.controls.map(c => c.value).filter((v: string) => v && v.trim());
    value.affiliations = this.affiliations.controls.map(c => c.value).filter((v: string) => v && v.trim());
    value.publications = this.publications.controls.map(c => c.value).filter((v: string) => v && v.trim());
    
    // Legacy fields
    value.education = this.education.controls.map(c => c.value).filter((v: string) => v && v.trim());
    value.previousSurgeries = this.previousSurgeries.controls.map(c => c.value).filter((v: string) => v && v.trim());
    value.surgeriesInPast = this.surgeriesInPast.controls.map(c => c.value).filter((v: string) => v && v.trim());
    value.preferredImplants = this.preferredImplants.controls.map(c => c.value).filter((v: string) => v && v.trim());
    
    if (this.isEditMode && this.doctorId) {
      this.doctorService.updateDoctor(this.doctorId, value).subscribe(() => {
        this.isSubmitting = false;
        this.router.navigate(['/doctors']);
      }, () => {
        this.isSubmitting = false;
      });
    } else {
      this.doctorService.addDoctor(value).subscribe(() => {
        this.isSubmitting = false;
        this.router.navigate(['/doctors']);
      }, () => {
        this.isSubmitting = false;
      });
    }
  }

  cancel() {
    this.router.navigate(['/doctors']);
  }
}
