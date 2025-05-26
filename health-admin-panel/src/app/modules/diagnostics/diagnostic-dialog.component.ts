import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DiagnosticTest } from './diagnostics.service';

@Component({
  selector: 'app-diagnostic-dialog',
  templateUrl: './diagnostic-dialog.component.html',
  styleUrls: ['./diagnostic-dialog.component.scss']
})
export class DiagnosticDialogComponent implements OnInit {
  diagnosticForm: FormGroup;
  dialogTitle: string;
  isEdit: boolean;
  viewOnly: boolean;
  
  // Predefined categories for diagnostic tests
  categories: string[] = ['Imaging', 'Laboratory', 'Screening', 'Procedure', 'Functional'];
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DiagnosticDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { test: DiagnosticTest | null, isEdit: boolean, viewOnly?: boolean }
  ) {
    this.isEdit = data.isEdit;
    this.viewOnly = data.viewOnly || false;
    this.dialogTitle = this.isEdit ? 'Edit Diagnostic Test' : 'Add New Diagnostic Test';
    
    if (this.viewOnly) {
      this.dialogTitle = 'Diagnostic Test Details';
    }
    
    this.diagnosticForm = this.fb.group({
      id: [data.test?.id || this.generateId(), Validators.required],
      name: [data.test?.name || '', Validators.required],
      description: [data.test?.description || '', Validators.required],
      price: [data.test?.price || 0, [Validators.required, Validators.min(0)]],
      duration: [data.test?.duration || 30, [Validators.required, Validators.min(1)]],
      preparationRequired: [data.test?.preparationRequired || false],
      preparationInstructions: [data.test?.preparationInstructions || ''],
      reportTime: [data.test?.reportTime || 24, [Validators.required, Validators.min(1)]],
      category: [data.test?.category || '', Validators.required],
      recommended: [data.test?.recommended || false]
    });
    
    if (this.viewOnly) {
      this.diagnosticForm.disable();
    }
  }

  ngOnInit(): void {
    // Enable/disable preparation instructions based on preparationRequired
    this.diagnosticForm.get('preparationRequired')?.valueChanges.subscribe(required => {
      const preparationInstructions = this.diagnosticForm.get('preparationInstructions');
      if (required) {
        preparationInstructions?.enable();
        preparationInstructions?.setValidators([Validators.required]);
      } else {
        preparationInstructions?.disable();
        preparationInstructions?.clearValidators();
        preparationInstructions?.setValue('');
      }
      preparationInstructions?.updateValueAndValidity();
    });
    
    // Trigger initial state for preparation instructions
    if (!this.viewOnly) {
      this.diagnosticForm.get('preparationRequired')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.diagnosticForm.valid) {
      const formValue = this.diagnosticForm.value;
      
      // If preparation is not required, ensure instructions are empty
      if (!formValue.preparationRequired) {
        formValue.preparationInstructions = '';
      }
      
      this.dialogRef.close(formValue);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  
  private generateId(): string {
    // Generate a simple ID based on the test name and timestamp
    const timestamp = new Date().getTime();
    return `test-${timestamp}`;
  }
}
