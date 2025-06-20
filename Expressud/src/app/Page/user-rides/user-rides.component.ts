import { Component, OnInit } from '@angular/core';
import { DriverService } from 'src/app/Services/driver.service';

@Component({
  selector: 'app-user-rides',
  templateUrl: './user-rides.component.html',
  styleUrl: './user-rides.component.css'
})
export class UserRidesComponent implements OnInit {

   rides: any[] = [];

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadRides();
  }

  private loadRides(): void {
    this.driverService.getUserRides().subscribe({
      next: data => this.rides = data,
      error: err => {
        console.error('Error loading rides', err);
        alert('Could not load your rides.');
      }
    });
  }

  cancelRide(rideId: number): void {
    if (!confirm('Are you sure you want to cancel this ride?')) {
      return;
    }

    // Prompt for a reason (your API requires it)
    const reason = prompt('Please enter a reason for cancellation:');
    if (!reason || reason.trim().length < 5) {
      alert('Cancellation aborted: please provide at least 5 characters.');
      return;
    }

    // Pass both rideId and reason
    this.driverService.cancelRide(rideId, reason.trim()).subscribe({
      next: () => {
        alert('Ride canceled successfully.');
        this.loadRides();  // refresh the list
      },
      error: err => {
        console.error('Cancel error:', err);
        alert(err.error?.message || 'Failed to cancel ride.');
      }
    });
  }

}
