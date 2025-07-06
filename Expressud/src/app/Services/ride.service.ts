import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface RideRequest {
  ride_type: string;
  pickup_location: string;
  destination: string;
  fare: number;
  currency: string;
  passengers: number;
}

export interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicle_type: string;
  vehicle_model: string;
  license_plate: string;
  rating: number;
  distance: number;
  time: number;
  price: number;
  image: string;
  is_available: boolean;
}

export interface Ride {
  id: number;
  user_id: number;
  driver_id?: number;
  ride_type: string;
  pickup_location: string;
  destination: string;
  fare: number;
  currency: string;
  passengers: number;
  status: string;
  created_at: string;
  driver?: Driver;
  proposed_price?: number;
  price_offer_message?: string;
  started_at?: string;
  completed_at?: string;
  eta?: string;
  cancellation_reason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private currentRideSubject = new BehaviorSubject<Ride | null>(null);
  public currentRide$ = this.currentRideSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Create a new ride and find available drivers
   */
  createRideAndFindDrivers(rideRequest: RideRequest): Observable<{ride: Ride, drivers: Driver[]}> {
    return this.http.post<{ride: Ride, drivers: Driver[]}>(
      `${this.apiUrl}/create-and-find-drivers`,
      rideRequest,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Confirm a ride with a specific driver
   */
  confirmRide(rideId: number, driverId: number): Observable<{message: string, ride: Ride}> {
    return this.http.post<{message: string, ride: Ride}>(
      `${this.apiUrl}/confirm-ride`,
      { ride_id: rideId, driver_id: driverId },
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Get user's ride history with proper error handling
   */
  getUserRides(): Observable<Ride[]> {
    console.log('🚗 Fetching user rides...');
    
    return this.http.get<any>(
      `${this.apiUrl}/user/rides`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        console.log('📊 User rides response:', response);
        
        // Handle different response formats
        let rides: Ride[] = [];
        
        if (response && response.success && Array.isArray(response.data)) {
          // New format with success wrapper
          rides = response.data;
          console.log(`✅ Loaded ${rides.length} rides (new format)`);
        } else if (Array.isArray(response)) {
          // Direct array format
          rides = response;
          console.log(`✅ Loaded ${rides.length} rides (direct format)`);
        } else {
          console.warn('⚠️ Unexpected response format:', response);
          rides = [];
        }
        
        // Validate and transform the data
        rides = rides.map(ride => ({
          ...ride,
          fare: Number(ride.fare) || 0,
          passengers: Number(ride.passengers) || 1,
          currency: ride.currency || 'RWF',
          ride_type: ride.ride_type || 'standard'
        }));
        
        console.log('🎯 Final processed rides:', rides);
        return rides;
      }),
      catchError(error => {
        console.error('❌ Error fetching user rides:', error);
        throw error;
      })
    );
  }

  /**
   * Get user's created rides
   */
  getCreatedRides(): Observable<Ride[]> {
    return this.http.get<Ride[]>(
      `${this.apiUrl}/rides/created`,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Cancel a ride
   */
  cancelRide(rideId: number, reason: string): Observable<{message: string, reason: string}> {
    return this.http.post<{message: string, reason: string}>(
      `${this.apiUrl}/cancel-ride/${rideId}`,
      { reason },
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Track ride status
   */
  trackRide(rideId: number): Observable<Ride> {
    return this.http.get<Ride>(
      `${this.apiUrl}/rides/${rideId}/track`,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Get real-time updates for a ride
   */
  getRideUpdates(rideId: number): Observable<Ride> {
    return this.http.get<Ride>(
      `${this.apiUrl}/rides/${rideId}/updates`,
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Rate a completed ride
   */
  rateRide(rideId: number, rating: number, comment?: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/rides/${rideId}/rate`,
      { rating, comment },
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Get ride fare estimation
   */
  getFareEstimate(pickup: string, destination: string, rideType: string): Observable<{fare: number}> {
    return this.http.post<{fare: number}>(
      `${this.apiUrl}/rides/fare-estimate`,
      { pickup_location: pickup, destination, ride_type: rideType },
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Set current ride
   */
  setCurrentRide(ride: Ride | null): void {
    this.currentRideSubject.next(ride);
  }

  /**
   * Get current ride
   */
  getCurrentRide(): Ride | null {
    return this.currentRideSubject.value;
  }

  /**
   * Calculate distance between two points (simplified)
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in kilometers
    return Math.round(d * 100) / 100; // Round to 2 decimal places
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Debug API call to check raw database content
   */
  debugUserRides(): Observable<any> {
    console.log('🔍 Debug: Checking raw database content...');
    
    return this.http.get<any>(
      `${this.apiUrl}/user/rides/debug`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        console.log('🔍 Debug response:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Debug API error:', error);
        throw error;
      })
    );
  }
}
