import { Component, OnInit, OnDestroy } from '@angular/core';
import { TripService } from '../../Services/trip.service';

@Component({
    selector: 'app-trip-requests',
    templateUrl: './trip-requests.component.html',
    styleUrl: './trip-requests.component.css',
    standalone: false
})
export class TripRequestsComponent implements OnInit, OnDestroy {
  currentTrips: any[] = [];
  tripRequests: any[] = [];
  tripHistory: any[] = [];
  private poller: any;
  showPriceModal = false;
  selectedTrip: any = null;
  newPrice = 0;
  priceMessage = '';
  activeTab = 'requests'; // 'requests', 'current', 'history'

  constructor(private tripService: TripService) {}

  ngOnInit(): void {
    this.loadCurrentTrips();
    this.loadTripRequests();
    this.loadTripHistory();
    // Optional: poll every 15s for new requests
    this.poller = setInterval(() => {
      this.loadTripRequests();
      this.loadCurrentTrips();
    }, 15000);
  }

  ngOnDestroy(): void {
    clearInterval(this.poller);
  }

  loadCurrentTrips(): void {
    this.tripService.getCurrentTrips().subscribe({
      next: data => {
        this.currentTrips = data;
      },
      error: err => {
        console.error('Error loading current trips:', err);
      }
    });
  }

  loadTripRequests(): void {
    this.tripService.getTripRequests().subscribe({
      next: data => {
        this.tripRequests = data;
      },
      error: err => {
        console.error('Error loading trip requests:', err);
      }
    });
  }

  loadTripHistory(): void {
    this.tripService.getTripHistory().subscribe({
      next: data => {
        this.tripHistory = data;
      },
      error: err => {
        console.error('Error loading trip history:', err);
      }
    });
  }

  accept(request: any): void {
    this.tripService.acceptTrip(request).subscribe({
      next: resp => {
        alert('Trip accepted!');
        // Refresh all lists
        this.loadTripRequests();
        this.loadCurrentTrips();
        this.activeTab = 'current';
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
        alert('Trip declined.');
        this.loadTripRequests();
      },
      error: err => {
        console.error('Decline failed', err);
        alert('Could not decline ride.');
      }
    });
  }

  // New methods for enhanced functionality
  openPriceModal(trip: any): void {
    this.selectedTrip = trip;
    this.newPrice = trip.fareEstimate || trip.fare;
    this.priceMessage = '';
    this.showPriceModal = true;
  }

  closePriceModal(): void {
    this.showPriceModal = false;
    this.selectedTrip = null;
  }

  submitPriceOffer(): void {
    if (!this.selectedTrip || this.newPrice <= 0) {
      alert('Please enter a valid price');
      return;
    }

    this.tripService.updateRidePrice(
      this.selectedTrip.id, 
      this.newPrice, 
      this.priceMessage || 'Driver price adjustment'
    ).subscribe({
      next: resp => {
        alert('Price offer sent to customer!');
        this.closePriceModal();
        this.loadTripRequests();
      },
      error: err => {
        console.error('Price offer failed', err);
        alert('Failed to send price offer');
      }
    });
  }

  startTrip(trip: any): void {
    if (!confirm('Start this trip?')) return;

    this.tripService.startTrip(trip.id).subscribe({
      next: resp => {
        alert('Trip started!');
        this.loadCurrentTrips();
      },
      error: err => {
        console.error('Start trip failed', err);
        alert('Could not start trip');
      }
    });
  }

  completeTrip(trip: any): void {
    if (!confirm('Mark this trip as completed?')) return;

    this.tripService.completeTrip(trip.id).subscribe({
      next: resp => {
        alert('Trip completed!');
        this.loadCurrentTrips();
        this.loadTripHistory();
      },
      error: err => {
        console.error('Complete trip failed', err);
        alert('Could not complete trip');
      }
    });
  }

  cancelCurrentTrip(trip: any): void {
    const reason = prompt('Please enter cancellation reason:');
    if (!reason || reason.trim().length < 5) {
      alert('Please provide a valid reason (at least 5 characters)');
      return;
    }

    this.tripService.cancelCurrentTrip(trip.id, reason.trim()).subscribe({
      next: resp => {
        alert('Trip cancelled');
        this.loadCurrentTrips();
        this.loadTripHistory();
      },
      error: err => {
        console.error('Cancel trip failed', err);
        alert('Could not cancel trip');
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'pending': return 'badge-warning';
      case 'confirmed': return 'badge-info';
      case 'in_progress': return 'badge-primary';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
}
