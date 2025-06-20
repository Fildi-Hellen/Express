import { Component, OnInit } from '@angular/core';
import { TripService } from '../../Services/trip.service';

@Component({
    selector: 'app-trip-requests',
    templateUrl: './trip-requests.component.html',
    styleUrl: './trip-requests.component.css',
    standalone: false
})
export class TripRequestsComponent  implements OnInit{
     currentTrips: any[] = [];
  tripRequests: any[] = [];
  private poller: any;

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadCurrentTrips();
    this.loadTripRequests();
    // Optional: poll every 15s for new requests
    this.poller = setInterval(() => this.loadTripRequests(), 15000);
  }

  ngOnDestroy(): void {
    clearInterval(this.poller);
  }

  loadCurrentTrips(): void {
    this.tripService.getCurrentTrips().subscribe(data => {
      this.currentTrips = data;
    });
  }

  loadTripRequests(): void {
    this.tripService.getTripRequests().subscribe(data => {
      this.tripRequests = data;
    });
  }

  accept(request: any): void {
    this.tripService.acceptTrip(request).subscribe({
      next: resp => {
        alert('Trip accepted!');
        // remove from “pending”
        this.tripRequests = this.tripRequests.filter(r => r.id !== request.id);
        // add to “current”
        this.currentTrips.push(resp.ride);
      },
      error: err => {
        console.error('Accept failed', err);
        alert('Could not accept ride.');
      }
    });
  }

  decline(request: any): void {
    this.tripService.declineTrip(request).subscribe({
      next: _ => {
        alert('Trip cancelled.');
        this.tripRequests = this.tripRequests.filter(r => r.id !== request.id);
      },
      error: err => {
        console.error('Cancel failed', err);
        alert('Could not cancel ride.');
      }
    });
  }

}
