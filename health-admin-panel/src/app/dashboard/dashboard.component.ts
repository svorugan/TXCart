import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats = {
    totalPatients: 1245,
    activeTreatments: 328,
    completedSurgeries: 892,
    upcomingSurgeries: 53
  };

  recentPatients = [
    { id: 1, name: 'Rahul Sharma', age: 65, surgery: 'Total Knee Replacement', date: '2025-06-15', status: 'Scheduled' },
    { id: 2, name: 'Priya Patel', age: 58, surgery: 'Total Hip Replacement', date: '2025-06-20', status: 'Pre-Op' },
    { id: 3, name: 'Suresh Kumar', age: 72, surgery: 'Partial Knee Replacement', date: '2025-06-25', status: 'Scheduled' },
    { id: 4, name: 'Anita Singh', age: 62, surgery: 'Total Hip Replacement', date: '2025-05-10', status: 'Post-Op' },
    { id: 5, name: 'Vikram Mehta', age: 59, surgery: 'Total Knee Replacement', date: '2025-05-05', status: 'Recovering' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToPatientJourney(): void {
    this.router.navigate(['/patient-journey']);
  }
}
