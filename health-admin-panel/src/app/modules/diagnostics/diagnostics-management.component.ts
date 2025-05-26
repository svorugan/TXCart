import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiagnosticsService, DiagnosticTest } from './diagnostics.service';
import { DiagnosticDialogComponent } from './diagnostic-dialog.component';

@Component({
  selector: 'app-diagnostics-management',
  templateUrl: './diagnostics-management.component.html',
  styleUrls: ['./diagnostics-management.component.scss']
})
export class DiagnosticsManagementComponent implements OnInit {
  diagnosticTests: DiagnosticTest[] = [];
  filteredTests: DiagnosticTest[] = [];
  categories: string[] = [];
  searchForm: FormGroup;
  
  displayedColumns: string[] = ['name', 'category', 'price', 'duration', 'reportTime', 'recommended', 'actions'];
  
  constructor(
    private fb: FormBuilder,
    private diagnosticsService: DiagnosticsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      category: [''],
      priceRange: [[0, 20000]],
      recommended: ['']
    });
  }

  ngOnInit(): void {
    this.loadDiagnosticTests();
    
    // Apply filters when form values change
    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadDiagnosticTests(): void {
    this.diagnosticsService.getDiagnosticTests().subscribe(tests => {
      this.diagnosticTests = tests;
      this.filteredTests = tests;
      
      // Extract unique categories
      this.categories = [...new Set(tests.map(test => test.category))];
      
      // Apply initial filters
      this.applyFilters();
    });
  }

  applyFilters(): void {
    const filterValues = this.searchForm.value;
    
    this.filteredTests = this.diagnosticTests.filter(test => {
      // Filter by name
      const nameMatch = !filterValues.name || 
        test.name.toLowerCase().includes(filterValues.name.toLowerCase());
      
      // Filter by category
      const categoryMatch = !filterValues.category || 
        test.category === filterValues.category;
      
      // Filter by price range
      const priceMatch = !filterValues.priceRange || 
        (test.price >= filterValues.priceRange[0] && 
         test.price <= filterValues.priceRange[1]);
      
      // Filter by recommended status
      const recommendedMatch = filterValues.recommended === '' || 
        test.recommended === (filterValues.recommended === 'true');
      
      return nameMatch && categoryMatch && priceMatch && recommendedMatch;
    });
  }

  resetFilters(): void {
    this.searchForm.reset({
      name: '',
      category: '',
      priceRange: [0, 20000],
      recommended: ''
    });
    this.filteredTests = this.diagnosticTests;
  }

  addDiagnosticTest(): void {
    const dialogRef = this.dialog.open(DiagnosticDialogComponent, {
      width: '800px',
      data: { test: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.diagnosticsService.addDiagnosticTest(result).subscribe(newTest => {
          this.diagnosticTests = [...this.diagnosticTests, newTest];
          this.applyFilters();
          
          this.snackBar.open('Diagnostic test added successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        }, error => {
          console.error('Error adding diagnostic test:', error);
          this.snackBar.open('Error adding diagnostic test', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        });
      }
    });
  }

  editDiagnosticTest(test: DiagnosticTest): void {
    const dialogRef = this.dialog.open(DiagnosticDialogComponent, {
      width: '800px',
      data: { test, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.diagnosticsService.updateDiagnosticTest(test.id, result).subscribe(updatedTest => {
          // Update the test in the lists
          this.diagnosticTests = this.diagnosticTests.map(item => 
            item.id === updatedTest.id ? updatedTest : item
          );
          
          this.applyFilters();
          
          this.snackBar.open('Diagnostic test updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        }, error => {
          console.error('Error updating diagnostic test:', error);
          this.snackBar.open('Error updating diagnostic test', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        });
      }
    });
  }

  viewDiagnosticTestDetails(test: DiagnosticTest): void {
    this.dialog.open(DiagnosticDialogComponent, {
      width: '800px',
      data: { test, isEdit: false, viewOnly: true }
    });
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? 
        `${hours} hr ${remainingMinutes} min` : 
        `${hours} hr`;
    }
  }

  formatReportTime(hours: number): string {
    if (hours < 24) {
      return `${hours} hours`;
    } else {
      const days = Math.floor(hours / 24);
      return days === 1 ? `${days} day` : `${days} days`;
    }
  }
}
