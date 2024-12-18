import { Component } from '@angular/core';
import { TripService } from '../../Services/trip.service';

@Component({
    selector: 'app-trip-history',
    templateUrl: './trip-history.component.html',
    styleUrl: './trip-history.component.css',
    standalone: false
})
export class TripHistoryComponent {
    trips: any[] = [];

    constructor(private tripService: TripService) {}
  
    ngOnInit(): void {
      this.loadTripHistory();
    }
  
    loadTripHistory(): void {
      this.tripService.getTripHistory().subscribe(data => {
        this.trips = data;
      });
    }

}
