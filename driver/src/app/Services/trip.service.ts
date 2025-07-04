import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface TripRequest {
  id: number;
  passengerName: string;
  pickupLocation: string;
  destination: string;
  eta: string;
  fareEstimate: number;
  distance?: number;
  passengers?: number;
  ride_type?: string;
}

export interface CurrentTrip {
  id: number;
  passengerName: string;
  pickupLocation: string;
  destination: string;
  fare: number;
  status: string;
  proposedPrice?: number;
  startedAt?: string;
  completedAt?: string;
}

export interface PriceOffer {
  ride_id: number;
  proposed_price: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No auth token; please log in.');
    return new HttpHeaders({ 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** Get new trip requests (pending rides) */
  getTripRequests(): Observable<TripRequest[]> {
    return this.http.get<TripRequest[]>(
      `${this.apiUrl}/driver/rides/requests`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** Get rides the driver has accepted */
  getCurrentTrips(): Observable<CurrentTrip[]> {
    return this.http.get<CurrentTrip[]>(
      `${this.apiUrl}/driver/rides/current`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** Accept a pending ride */
  acceptTrip(request: TripRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/rides/${request.id}/accept`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /** Cancel a previously confirmed ride */
  declineTrip(request: TripRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/rides/${request.id}/cancel`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /** 
   * Make a price offer for a ride (increase price)
   * This allows the driver to propose a higher price than the initial estimate
   */
  makePriceOffer(priceOffer: PriceOffer): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/rides/${priceOffer.ride_id}/price-offer`,
      {
        proposed_price: priceOffer.proposed_price,
        message: priceOffer.message || 'Driver price adjustment'
      },
      { headers: this.getAuthHeaders() }
    );
  }

  /** Cancel current trip with reason */
  cancelCurrentTrip(tripId: number, reason: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/rides/${tripId}/cancel`,
      { reason },
      { headers: this.getAuthHeaders() }
    );
  }

  /** Update the price for a pending ride */
  updateRidePrice(tripId: number, newPrice: number, message?: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/rides/${tripId}/price-offer`,
      { proposed_price: newPrice, message },
      { headers: this.getAuthHeaders() }
    );
  }

  /** Start trip (when driver reaches pickup location) */
  startTrip(tripId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/rides/${tripId}/start`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /** Complete trip */
  completeTrip(tripId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/rides/${tripId}/complete`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /** Get trip history */
  getTripHistory(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/driver/rides/history`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** Update driver availability */
  updateAvailability(isAvailable: boolean): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/availability`,
      { is_available: isAvailable },
      { headers: this.getAuthHeaders() }
    );
  }

  /** Get driver profile and stats */
  getDriverProfile(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/driver/profile`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** Update driver location */
  updateLocation(latitude: number, longitude: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/driver/location`,
      { latitude, longitude },
      { headers: this.getAuthHeaders() }
    );
  }
}
