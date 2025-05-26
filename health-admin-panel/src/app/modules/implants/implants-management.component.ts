import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImplantsService, Implant, surgeryTypeMap } from './implants.service';
import { ImplantDialogComponent } from './implant-dialog.component';

@Component({
  selector: 'app-implants-management',
  templateUrl: './implants-management.component.html',
  styleUrls: ['./implants-management.component.scss']
})
export class ImplantsManagementComponent implements OnInit {
  implants: Implant[] = [];
  filteredImplants: Implant[] = [];
  searchForm: FormGroup;
  displayedColumns: string[] = ['name', 'manufacturer', 'origin', 'tier', 'price', 'materials', 'actions'];
  
  // Orthopedic surgery types for filtering
  surgeryTypes: string[] = [];
  
  // Manufacturers from our data
  indianManufacturers: string[] = [];
  importedManufacturers: string[] = [];
  
  // Surgery type mapping for display
  surgeryTypeMap = surgeryTypeMap;

  constructor(
    private fb: FormBuilder,
    private implantsService: ImplantsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      manufacturer: [''],
      origin: ['Indian'], // Default to Indian implants
      tier: [''],
      surgeryType: [''],
      priceRange: ['']
    });
  }

  ngOnInit(): void {
    this.loadImplants();
  }
  
  private extractManufacturers(implants: Implant[]): void {
    // Extract unique manufacturers and categorize by origin
    const indianSet = new Set<string>();
    const importedSet = new Set<string>();
    
    implants.forEach(implant => {
      if (implant.origin === 'Indian') {
        indianSet.add(implant.manufacturer);
      } else {
        importedSet.add(implant.manufacturer);
      }
    });
    
    this.indianManufacturers = Array.from(indianSet).sort();
    this.importedManufacturers = Array.from(importedSet).sort();
  }
  
  private extractSurgeryTypes(implants: Implant[]): void {
    // Extract unique surgery types from the data
    const surgeryCodesSet = new Set<string>();
    
    implants.forEach(implant => {
      implant.compatibleSurgeries.forEach(surgery => {
        surgeryCodesSet.add(surgery);
      });
    });
    
    // Convert surgery codes to display names using the mapping
    this.surgeryTypes = Array.from(surgeryCodesSet)
      .map(code => surgeryTypeMap[code] || code)
      .filter(name => !!name)
      .sort();
  }

  loadImplants(): void {
    // Load all implants first to extract metadata
    this.implantsService.getImplants().subscribe(allImplants => {
      // Extract metadata from all implants
      this.extractManufacturers(allImplants);
      this.extractSurgeryTypes(allImplants);
      
      // Then filter to show only Indian implants initially
      const indianImplants = allImplants.filter(implant => implant.origin === 'Indian');
      this.implants = indianImplants;
      this.filteredImplants = indianImplants;
    });
  }

  searchImplants(): void {
    const filters = this.searchForm.value;
    
    this.filteredImplants = this.implants.filter(implant => {
      // Filter by name
      if (filters.name && !implant.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      
      // Filter by manufacturer
      if (filters.manufacturer && implant.manufacturer !== filters.manufacturer) {
        return false;
      }
      
      // Filter by tier
      if (filters.tier && implant.tier !== filters.tier) {
        return false;
      }
      
      // Filter by surgery type
      if (filters.surgeryType) {
        // Find the surgery code that maps to the selected display name
        const surgeryCode = Object.entries(surgeryTypeMap)
          .find(([code, name]) => name === filters.surgeryType)?.[0];
          
        if (surgeryCode && !implant.compatibleSurgeries.includes(surgeryCode)) {
          return false;
        }
      }
      
      // Filter by price range
      if (filters.priceRange) {
        const [min, max] = this.getPriceRange(filters.priceRange);
        if (implant.price < min || (max && implant.price > max)) {
          return false;
        }
      }
      
      return true;
    });
  }

  resetSearch(): void {
    this.searchForm.patchValue({
      name: '',
      manufacturer: '',
      tier: '',
      surgeryType: '',
      priceRange: ''
    });
    this.filteredImplants = this.implants;
  }

  toggleOrigin(origin: 'Indian' | 'Imported'): void {
    this.searchForm.patchValue({ origin, manufacturer: '' }); // Reset manufacturer when switching origin
    
    this.implantsService.getImplants().subscribe(allImplants => {
      const filteredImplants = allImplants.filter(implant => implant.origin === origin);
      this.implants = filteredImplants;
      this.filteredImplants = filteredImplants;
    });
  }

  private getPriceRange(range: string): [number, number | null] {
    switch (range) {
      case 'under25k':
        return [0, 25000];
      case '25k-50k':
        return [25000, 50000];
      case '50k-100k':
        return [50000, 100000];
      case 'above100k':
        return [100000, null];
      default:
        return [0, null];
    }
  }

  viewImplantDetails(implant: Implant): void {
    // Open the dialog in view-only mode (could be enhanced to a dedicated view dialog)
    this.openImplantDialog(implant, true);
  }
  
  addImplant(): void {
    const dialogRef = this.dialog.open(ImplantDialogComponent, {
      width: '800px',
      data: { implant: null, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.implantsService.addImplant(result).subscribe(newImplant => {
          // If the origin matches the current filter, add to the list
          if (newImplant.origin === this.searchForm.get('origin')?.value) {
            this.implants = [...this.implants, newImplant];
            this.filteredImplants = [...this.filteredImplants, newImplant];
          }
          
          this.snackBar.open('Implant added successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        }, error => {
          console.error('Error adding implant:', error);
          this.snackBar.open('Error adding implant', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        });
      }
    });
  }
  
  editImplant(implant: Implant): void {
    this.openImplantDialog(implant, true);
  }
  
  private openImplantDialog(implant: Implant, isEdit: boolean): void {
    const dialogRef = this.dialog.open(ImplantDialogComponent, {
      width: '800px',
      data: { implant, isEdit }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && isEdit) {
        this.implantsService.updateImplant(implant.id, result).subscribe(updatedImplant => {
          // Update the implant in the lists
          this.implants = this.implants.map(item => 
            item.id === updatedImplant.id ? updatedImplant : item
          );
          
          this.filteredImplants = this.filteredImplants.map(item => 
            item.id === updatedImplant.id ? updatedImplant : item
          );
          
          this.snackBar.open('Implant updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        }, error => {
          console.error('Error updating implant:', error);
          this.snackBar.open('Error updating implant', 'Close', {
            duration: 3000,
            horizontalPosition: 'end'
          });
        });
      }
    });
  }
}
