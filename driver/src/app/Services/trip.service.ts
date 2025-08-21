import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface TripRequest {
  id: number;
  user_id?: number;        // Add customer ID field
  customer_id?: number;    // Alternative customer ID field
  passengerName: string;
  pickupLocation: string;
  destination: string;
  eta: string;
  fareEstimate: number;
  distance?: string;
  passengers?: number;
  ride_type?: string;
  requestTime?: string;
}

export interface CurrentTrip {
  id: number;
  user_id?: number;        // Add customer ID field
  customer_id?: number;    // Alternative customer ID field
  passengerName: string;
  pickupLocation: string;
  destination: string;
  fare: number;
  status: string;
  proposedPrice?: number;
  startedAt?: string;
  completedAt?: string;
  assignedAt?: string;
}

export interface TripHistory {
  id: number;
  passengerName: string;
  pickupLocation: string;
  destination: string;
  fare: number;
  status: string;
  date: string;
  completedAt?: string;
}

export interface PriceOffer {
  ride_id: number;
  proposed_price: number;
  message?: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {

private base = environment.apiBase;
  private currentDriverId: string | null = null;
  private currentDriverName: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize driver info from localStorage
    this.initializeDriverInfo();
  }

  /**
   * Initialize driver information from localStorage
   */
  private initializeDriverInfo(): void {
    this.currentDriverId = localStorage.getItem('driverId');
    this.currentDriverName = localStorage.getItem('driverName');
    
    if (this.currentDriverId) {
      console.log(`🔐 TripService initialized for driver: ${this.currentDriverName} (ID: ${this.currentDriverId})`);
    }
  }

  /**
   * Get authenticated headers with driver validation
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    const driverId = localStorage.getItem('driverId');
    
    if (!token || !driverId) {
      console.error('❌ Authentication required: Missing token or driver ID');
      this.handleAuthenticationError();
      throw new Error('Authentication required. Please log in.');
    }

    // Update current driver info if changed
    if (this.currentDriverId !== driverId) {
      this.initializeDriverInfo();
    }

    return new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Driver-ID': driverId // Additional security header
    });
  }

  /**
   * Handle authentication errors
   */
  private handleAuthenticationError(): void {
    console.error('🚨 Authentication error - redirecting to login');
    localStorage.removeItem('authToken');
    localStorage.removeItem('driverId');
    localStorage.removeItem('driverName');
    this.currentDriverId = null;
    this.currentDriverName = null;
    this.router.navigate(['/driver-auth']);
  }

  /**
   * Enhanced error handling
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`❌ ${operation} failed:`, error);

      // Handle specific HTTP error codes
      if (error.status === 401) {
        console.error('🚨 Unauthorized access - token expired or invalid');
        this.handleAuthenticationError();
        return throwError(() => new Error('Authentication expired. Please log in again.'));
      } else if (error.status === 403) {
        console.error('🚨 Forbidden - driver not authorized for this action');
        return throwError(() => new Error('You are not authorized to perform this action.'));
      } else if (error.status === 404) {
        console.error('🚨 Resource not found');
        return throwError(() => new Error('Requested resource not found.'));
      } else if (error.status === 0) {
        console.error('🚨 Network error - server may be offline');
        return throwError(() => new Error('Unable to connect to server. Please check your connection.'));
      }

      // Return a safe fallback or rethrow the error
      if (result !== undefined) {
        return of(result as T);
      }
      
      return throwError(() => error);
    };
  }

  /**
   * Get driver info
   */
  getCurrentDriverInfo(): DriverInfo | null {
    if (!this.currentDriverId) {
      return null;
    }

    return {
      id: this.currentDriverId,
      name: this.currentDriverName || 'Unknown Driver',
      email: localStorage.getItem('driverEmail') || '',
      phone: localStorage.getItem('driverPhone') || '',
      isAvailable: localStorage.getItem('driverAvailable') === 'true'
    };
  }

  /**
   * Get available trip requests (unassigned pending rides)
   * Security: Only shows rides that don't have a driver assigned yet
   * @param filterByDriver - If true, applies driver-specific filtering
   * @param showAll - If false, applies additional filters
   */
  getTripRequests(filterByDriver: boolean = false, showAll: boolean = true): Observable<TripRequest[]> {
    console.log(`📥 Getting available trip requests for driver ${this.currentDriverId} (filtered: ${filterByDriver})`);
    
    // Build query parameters
    let params = new HttpParams();
    if (filterByDriver) {
      params = params.set('filter_by_driver', 'true');
    }
    if (!showAll) {
      params = params.set('show_all', 'false');
    }
    
    return this.http.get<any>(
      `${this.base}/driver/trip-requests`,
      { 
        headers: this.getAuthHeaders(),
        params: params
      }
    ).pipe(
      map(response => {
        console.log('📊 Trip requests response:', response);
        
        // Handle the backend response format
        let requests: TripRequest[] = [];
        
        if (response && response.success && Array.isArray(response.data)) {
          requests = response.data;
        } else if (Array.isArray(response)) {
          requests = response;
        }

        const filterStatus = response.filtering_applied ? 'driver-specific' : 'all available';
        console.log(`✅ Loaded ${requests.length} ${filterStatus} trip requests - filtered automatically by backend`);
        console.log(`🔒 Security: Driver ${this.currentDriverId} can only see unassigned pending rides`);
        
        if (response.filtering_applied) {
          console.log(`🎯 Filter applied: Only showing requests relevant to driver ${this.currentDriverId}`);
        }
        
        return requests;
      }),
      catchError(this.handleError<TripRequest[]>('getTripRequests', []))
    );
  }

  /**
   * Get current trips assigned to the logged-in driver
   * Security: Only returns trips assigned to this specific driver
   */
  getCurrentTrips(): Observable<CurrentTrip[]> {
    console.log(`📥 Getting current trips for driver ${this.currentDriverId}`);
    
    return this.http.get<any>(
      `${this.base}/driver/current-trips`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        console.log('📊 Current trips response:', response);
        
        let trips: CurrentTrip[] = [];
        
        if (response && response.success && Array.isArray(response.data)) {
          trips = response.data;
        } else if (Array.isArray(response)) {
          trips = response;
        }

        console.log(`✅ Loaded ${trips.length} current trips assigned to driver ${this.currentDriverId}`);
        console.log(`🔒 Security: Backend automatically filters trips by driver_id = ${this.currentDriverId}`);
        return trips;
      }),
      catchError(this.handleError<CurrentTrip[]>('getCurrentTrips', []))
    );
  }

  /**
   * Get trip history for the logged-in driver
   * Security: Only returns completed/cancelled trips for this driver
   */
  getTripHistory(): Observable<TripHistory[]> {
    console.log(`📥 Getting trip history for driver ${this.currentDriverId}`);
    
    return this.http.get<any>(
      `${this.base}/driver/trip-history`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        console.log('📊 Trip history response:', response);
        
        let history: TripHistory[] = [];
        
        if (response && response.success && Array.isArray(response.data)) {
          history = response.data;
        } else if (Array.isArray(response)) {
          history = response;
        }

        console.log(`✅ Loaded ${history.length} historical trips for driver ${this.currentDriverId}`);
        console.log(`🔒 Security: Backend automatically filters completed/cancelled trips by driver_id = ${this.currentDriverId}`);
        return history;
      }),
      catchError(this.handleError<TripHistory[]>('getTripHistory', []))
    );
  }

  /**
   * Accept a pending ride
   * Security: Driver can only accept unassigned rides
   */
  acceptTrip(request: TripRequest): Observable<any> {
    console.log(`🚗 Driver ${this.currentDriverId} accepting trip ${request.id}`);
    
    return this.http.post<any>(
      `${this.base}/driver/trip-accept/${request.id}`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log(`✅ Trip ${request.id} accepted successfully by driver ${this.currentDriverId}`, response);
      }),
      catchError(this.handleError('acceptTrip'))
    );
  }

  /**
   * Decline/Skip a trip request
   * Note: This doesn't call an API since it's just removing from local view
   */
  declineTrip(request: TripRequest): Observable<any> {
    console.log(`❌ Driver ${this.currentDriverId} declined trip ${request.id}`);
    
    // For available requests, we don't need to call API
    // Just return success since the trip remains available for other drivers
    return of({ success: true, message: 'Trip declined locally' });
  }

  /**
   * Cancel a trip assigned to the current driver
   * Security: Driver can only cancel their own assigned trips
   */
  cancelCurrentTrip(tripId: number, reason: string): Observable<any> {
    console.log(`❌ Driver ${this.currentDriverId} cancelling trip ${tripId} - Reason: ${reason}`);
    
    return this.http.post<any>(
      `${this.base}/driver/trip-cancel/${tripId}`,
      { reason },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log(`✅ Trip ${tripId} cancelled by driver ${this.currentDriverId}`, response);
      }),
      catchError(this.handleError('cancelCurrentTrip'))
    );
  }

  /**
   * Make a price offer for a ride
   * Security: Driver can only make offers on available rides
   */
  updateRidePrice(tripId: number, newPrice: number, message?: string): Observable<any> {
    console.log(`💰 Driver ${this.currentDriverId} making price offer: $${newPrice} for trip ${tripId}`);
    
    return this.http.post<any>(
      `${this.base}/driver/rides/${tripId}/price-offer`,
      { 
        proposed_price: newPrice, 
        message: message || 'Driver price adjustment' 
      },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log(`✅ Price offer sent by driver ${this.currentDriverId}`, response);
      }),
      catchError(this.handleError('updateRidePrice'))
    );
  }

  /**
   * Start a trip assigned to the current driver
   * Security: Driver can only start their own assigned trips
   */
  startTrip(tripId: number): Observable<any> {
    console.log(`🏁 Driver ${this.currentDriverId} starting trip ${tripId}`);
    
    return this.http.post<any>(
      `${this.base}/driver/trip-start/${tripId}`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log(`✅ Trip ${tripId} started by driver ${this.currentDriverId}`, response);
      }),
      catchError(this.handleError('startTrip'))
    );
  }

  /**
   * Complete a trip assigned to the current driver
   * Security: Driver can only complete their own trips
   */
  completeTrip(tripId: number): Observable<any> {
    console.log(`🏁 Driver ${this.currentDriverId} completing trip ${tripId}`);
    
    return this.http.post<any>(
      `${this.base}/driver/rides/${tripId}/complete`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log(`✅ Trip ${tripId} completed by driver ${this.currentDriverId}`, response);
      }),
      catchError(this.handleError('completeTrip'))
    );
  }

  /**
   * Update driver availability status
   */
  updateAvailability(isAvailable: boolean): Observable<any> {
    console.log(`🔄 Driver ${this.currentDriverId} updating availability to: ${isAvailable}`);
    
    return this.http.post<any>(
      `${this.base}/driver/availability`,
      { is_available: isAvailable },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log(`✅ Driver availability updated`, response);
        // Update local storage
        localStorage.setItem('driverAvailable', isAvailable.toString());
      }),
      catchError(this.handleError('updateAvailability'))
    );
  }

  /**
   * Get driver profile and stats
   */
  getDriverProfile(): Observable<any> {
    console.log(`👤 Getting profile for driver ${this.currentDriverId}`);
    
    return this.http.get<any>(
      `${this.base}/driver/profile`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log(`✅ Driver profile loaded`, response);
      }),
      catchError(this.handleError('getDriverProfile'))
    );
  }

  /**
   * Update driver location
   */
  updateLocation(latitude: number, longitude: number): Observable<any> {
    console.log(`📍 Driver ${this.currentDriverId} updating location: ${latitude}, ${longitude}`);
    
    return this.http.post<any>(
      `${this.base}/driver/location`,
      { latitude, longitude },
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log(`✅ Driver location updated`, response);
      }),
      catchError(this.handleError('updateLocation'))
    );
  }

  /**
   * Check if driver is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const driverId = localStorage.getItem('driverId');
    return !!(token && driverId);
  }

  /**
   * Get current driver ID
   */
  getCurrentDriverId(): string | null {
    return this.currentDriverId;
  }

  /**
   * Get current driver name
   */
  getCurrentDriverName(): string | null {
    return this.currentDriverName;
  }

  /**
   * Logout current driver
   */
  logout(): void {
    console.log(`👋 Driver ${this.currentDriverId} logging out`);
    
    // Clear all driver-related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('driverId');
    localStorage.removeItem('driverName');
    localStorage.removeItem('driverEmail');
    localStorage.removeItem('driverPhone');
    localStorage.removeItem('driverAvailable');
    
    this.currentDriverId = null;
    this.currentDriverName = null;
    
    // Redirect to login
    this.router.navigate(['/driver-auth']);
  }

  /**
   * Validate driver session and refresh if needed
   */
  validateSession(): Observable<boolean> {
    if (!this.isAuthenticated()) {
      return of(false);
    }

    return this.getDriverProfile().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}