import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor() {}

  getTripHistory(): Observable<any[]> {
    // Mock trip data
    const trips = [
      { date: new Date('2024-12-01'), earnings: 25.00, rating: 5, passenger: 'John Doe', notes: 'Morning commute, very polite.' },
      { date: new Date('2024-12-02'), earnings: 10.00, rating: 4, passenger: 'Jane Smith', notes: 'Short trip, on time.' },
      { date: new Date('2024-12-03'), earnings: 15.75, rating: 4, passenger: 'Carlos Perez', notes: 'Traffic was heavy, but smooth ride.' },
      { date: new Date('2024-12-04'), earnings: 8.50, rating: 3, passenger: 'Amina Khan', notes: 'Could improve cleanliness.' }
    ];
    return of(trips);
  }

  getCurrentTrips(): Observable<any[]> {
    // Mock data for ongoing trips
    const trips = [
      {
        passengerName: 'John Doe',
        pickupLocation: '123 Main St',
        destination: '456 Elm St',
        eta: '10 mins',
        fare: 15.00
      },
      {
        passengerName: 'Jane Smith',
        pickupLocation: '789 Oak Ave',
        destination: '101 Pine Rd',
        eta: '5 mins',
        fare: 8.50
      }
    ];
    return of(trips);
  }

  getTripRequests(): Observable<any[]> {
    // Mock data for new trip requests
    const requests = [
      {
        passengerName: 'Alex Johnson',
        pickupLocation: '202 Maple Dr',
        destination: '303 Birch Ln',
        distance: '3.2 km',
        fareEstimate: 10.00
      },
      {
        passengerName: 'Emily Clark',
        pickupLocation: '404 Walnut St',
        destination: '505 Cedar Ave',
        distance: '5.5 km',
        fareEstimate: 18.50
      }
    ];
    return of(requests);
  }

  acceptTrip(request: any): Observable<any> {
    // In a real scenario, send acceptance to backend
    return of({ success: true });
  }

  declineTrip(request: any): Observable<any> {
    // In a real scenario, send decline notification to backend
    return of({ success: true });
  }
  

}
