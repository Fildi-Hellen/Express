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
  
    constructor(private tripService: TripService) {}
  
    ngOnInit(): void {
      this.loadCurrentTrips();
      this.loadTripRequests();
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
      this.tripService.acceptTrip(request).subscribe(response => {
        if (response.success) {
          alert('Trip accepted!');
          this.tripRequests = this.tripRequests.filter(r => r !== request);
          // Optionally, add to current trips
        }
      });
    }
  
    decline(request: any): void {
      this.tripService.declineTrip(request).subscribe(response => {
        if (response.success) {
          alert('Trip declined.');
          this.tripRequests = this.tripRequests.filter(r => r !== request);
        }
      });
    }

}
