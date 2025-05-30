import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PatientJourneyComponent } from '../patient-journey/patient-journey.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PatientJourneyComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'TXCart - Your Healthcare Journey';
  showJourney = true; // Control the visibility of the patient journey component
  
  features = [
    {
      icon: 'search',
      title: 'Find the Right Surgery',
      description: 'Browse through various surgery options and find the one that suits your needs.'
    },
    {
      icon: 'person',
      title: 'Choose Your Surgeon',
      description: 'Select from experienced surgeons with detailed profiles and patient reviews.'
    },
    {
      icon: 'local_hospital',
      title: 'Select a Hospital',
      description: 'Find hospitals near you with the facilities you need for your procedure.'
    },
    {
      icon: 'event_available',
      title: 'Schedule Appointment',
      description: 'Book your appointment online and get instant confirmation.'
    }
  ];
  
  toggleJourney(): void {
    this.showJourney = !this.showJourney;
  }
}
