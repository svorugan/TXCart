import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Implant, surgeryTypeMap } from './implants.service';

@Component({
  selector: 'app-implant-dialog',
  templateUrl: './implant-dialog.component.html',
  styleUrls: ['./implant-dialog.component.scss']
})
export class ImplantDialogComponent implements OnInit {
  implantForm: FormGroup;
  dialogTitle: string;
  isEditMode: boolean;
  surgeryTypeMap = surgeryTypeMap;
  surgeryTypes = Object.entries(surgeryTypeMap).map(([code, name]) => ({ code, name }));
  
  tiers = [
    { value: 'Economy', label: 'Economy' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Premium', label: 'Premium' }
  ];
  
  origins = [
    { value: 'Indian', label: 'Indian' },
    { value: 'Imported', label: 'Imported' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ImplantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { implant: Implant, isEdit: boolean }
  ) {
    this.isEditMode = data.isEdit;
    this.dialogTitle = this.isEditMode ? 'Edit Implant' : 'Add New Implant';
    
    this.implantForm = this.fb.group({
      id: [this.generateId()],
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      origin: ['Indian', Validators.required],
      tier: ['Standard', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      warranty: [0, [Validators.required, Validators.min(0)]],
      longevity: [0, [Validators.required, Validators.min(0)]],
      materials: this.fb.array([this.fb.control('')]),
      compatibleSurgeries: [[]],
      features: this.fb.array([this.fb.control('')])
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.implant) {
      // If editing, populate the form with existing implant data
      const implant = this.data.implant;
      
      // Clear the materials and features arrays
      while (this.materials.length) {
        this.materials.removeAt(0);
      }
      
      while (this.features.length) {
        this.features.removeAt(0);
      }
      
      // Add materials
      if (implant.materials && implant.materials.length) {
        implant.materials.forEach(material => {
          this.materials.push(this.fb.control(material));
        });
      } else {
        this.materials.push(this.fb.control(''));
      }
      
      // Add features
      if (implant.features && implant.features.length) {
        implant.features.forEach(feature => {
          this.features.push(this.fb.control(feature));
        });
      } else {
        this.features.push(this.fb.control(''));
      }
      
      // Set the form values
      this.implantForm.patchValue({
        id: implant.id,
        name: implant.name,
        manufacturer: implant.manufacturer,
        origin: implant.origin,
        tier: implant.tier,
        description: implant.description,
        price: implant.price,
        warranty: implant.warranty,
        longevity: implant.longevity,
        compatibleSurgeries: implant.compatibleSurgeries
      });
    }
  }
  
  // Generate a simple ID for new implants
  private generateId(): string {
    const prefix = this.implantForm?.get('name')?.value?.toLowerCase().replace(/\s+/g, '-').substring(0, 10) || 'implant';
    const timestamp = Date.now().toString().substring(8);
    return `${prefix}-${timestamp}`;
  }
  
  // Getters for form arrays
  get materials(): FormArray {
    return this.implantForm.get('materials') as FormArray;
  }
  
  get features(): FormArray {
    return this.implantForm.get('features') as FormArray;
  }
  
  // Add item to a form array
  addItem(formArray: FormArray): void {
    formArray.push(this.fb.control(''));
  }
  
  // Remove item from a form array
  removeItem(formArray: FormArray, index: number): void {
    if (formArray.length > 1) {
      formArray.removeAt(index);
    }
  }
  
  // Submit the form
  onSubmit(): void {
    if (this.implantForm.invalid) {
      return;
    }
    
    // Process the form values
    const formValue = this.implantForm.value;
    
    // Filter out empty materials and features
    formValue.materials = this.materials.controls
      .map(control => control.value)
      .filter(value => value.trim() !== '');
      
    formValue.features = this.features.controls
      .map(control => control.value)
      .filter(value => value.trim() !== '');
    
    // If no materials or features were added, provide empty arrays
    if (formValue.materials.length === 0) {
      formValue.materials = [];
    }
    
    if (formValue.features.length === 0) {
      formValue.features = [];
    }
    
    // Close the dialog and return the form value
    this.dialogRef.close(formValue);
  }
  
  // Cancel and close the dialog
  onCancel(): void {
    this.dialogRef.close();
  }
}
