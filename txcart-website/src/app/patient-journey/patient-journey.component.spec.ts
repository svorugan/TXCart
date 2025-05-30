import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientJourneyComponent } from './patient-journey.component';

describe('PatientJourneyComponent', () => {
  let component: PatientJourneyComponent;
  let fixture: ComponentFixture<PatientJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientJourneyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
