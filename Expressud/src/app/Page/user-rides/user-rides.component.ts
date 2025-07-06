import { Component, OnInit } from '@angular/core';
import { RideService } from 'src/app/Services/ride.service';

@Component({
  selector: 'app-user-rides',
  templateUrl: './user-rides.component.html',
  styleUrl: './user-rides.component.css'
})
export class UserRidesComponent implements OnInit {

   rides: any[] = [];

  constructor(private rideService: RideService) {}

  ngOnInit(): void {
    this.loadRides();
  }

  private loadRides(): void {
    this.rideService.getUserRides().subscribe({
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
    this.rideService.cancelRide(rideId, reason.trim()).subscribe({
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

  trackRide(rideId: number): void {
    this.rideService.trackRide(rideId).subscribe({
      next: ride => {
        alert(`Ride Status: ${ride.status}`);
      },
      error: err => {
        console.error('Tracking error:', err);
        alert('Could not track ride.');
      }
    });
  }

  rateRide(rideId: number): void {
    const rating = prompt('Rate this ride (1-5 stars):');
    if (!rating || isNaN(+rating) || +rating < 1 || +rating > 5) {
      alert('Please enter a valid rating between 1-5');
      return;
    }
    
    const comment = prompt('Any comments? (optional):');
    
    this.rideService.rateRide(rideId, +rating, comment || undefined).subscribe({
      next: () => {
        alert('Thank you for rating!');
        this.loadRides();
      },
      error: err => {
        console.error('Rating error:', err);
        alert('Failed to submit rating.');
      }
    });
  }

}
