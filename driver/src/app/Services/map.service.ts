import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  getRouteDetails(origin: [number, number], destination: [number, number]): Observable<any> {
    // Mock route details: In real scenario call a routing API (e.g., Mapbox Directions API)
    const route = {
      distance: '5.2 km',
      duration: '12 mins',
      steps: [
        'Head north on Main St',
        'Turn right onto Oak Ave',
        'Continue straight onto Maple Dr',
        'Your destination will be on the left'
      ]
    };
    return of(route);
  }

  shareLocation(): Observable<any> {
    // In a real scenario, send driver's current location to a server or generate a shareable link
    return of({ success: true, link: 'https://example.com/track?driverId=123' });
  }


}
