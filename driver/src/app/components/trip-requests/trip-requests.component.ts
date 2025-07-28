/**
 * TripRequestsComponent - Driver Trip Management with Filtering
 * 
 * FILTERING SYSTEM:
 * ================
 * This component now supports driver-specific filtering for trip requests:
 * 
 * 1. filterByDriver (default: true)
 *    - When ON: Shows only requests relevant to the current driver
 *    - When OFF: Shows all available unassigned requests
 * 
 * 2. showAllRequests (default: false, only when filterByDriver is true)
 *    - When ON: Shows all relevant requests for the driver
 *    - When OFF: Shows only recent requests (last 2 hours)
 * 
 * BACKEND FILTERING:
 * - All filtering is done securely on the backend
 * - Only unassigned pending rides are ever shown
 * - Driver authentication ensures security
 * 
 * USAGE:
 * - Toggle "Filter for me" to switch between all requests vs driver-specific
 * - When filtering is on, toggle "Show all" to see historical vs recent only
 * - Filter status is shown in the header and on individual request cards
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TripService } from '../../Services/trip.service';
import { Router } from '@angular/router';

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

  // Loading states
  isLoadingRequests = false;
  isLoadingCurrent = false;
  isLoadingHistory = false;

  // Driver info
  driverId: string | null = null;
  driverName: string | null = null;

  // Filtering options
  filterByDriver: boolean = true; // Default to show filtered results
  showAllRequests: boolean = false; // Default to show filtered results

  // Error handling
  errorMessage = '';
  successMessage = '';

  constructor(
    private tripService: TripService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if driver is authenticated
    this.driverId = localStorage.getItem('driverId');
    this.driverName = localStorage.getItem('driverName') || 'Driver';
    const authToken = localStorage.getItem('authToken');

    if (!this.driverId || !authToken) {
      console.error('❌ Driver not authenticated');
      this.errorMessage = 'Please log in to access trip management.';
      setTimeout(() => {
        this.router.navigate(['/driver-auth']);
      }, 3000);
      return;
    }

    console.log(`✅ Authenticated driver: ${this.driverName} (ID: ${this.driverId})`);
    console.log(`🔒 TRIP FILTERING: All trips are automatically filtered by driver ID on the backend`);
    console.log(`   - Available Requests: Shows unassigned pending rides (any driver can accept)`);
    console.log(`   - Current Trips: Shows only trips assigned to driver ID ${this.driverId}`);
    console.log(`   - Trip History: Shows only completed trips for driver ID ${this.driverId}`);

    // Load initial data
    this.loadCurrentTrips();
    this.loadTripRequests();
    this.loadTripHistory();

    // Poll for updates every 20 seconds (optimized frequency)
    this.poller = setInterval(() => {
      // Only poll if not currently loading to avoid duplicate requests
      if (!this.isLoadingRequests && !this.isLoadingCurrent) {
        this.loadTripRequests();
        this.loadCurrentTrips();
      }
    }, 20000);

    console.log('🔄 Auto-refresh started (every 20 seconds)');
    
    // Add debugging after data loads
    setTimeout(() => {
      this.debugTripData();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.poller) {
      clearInterval(this.poller);
      console.log('🛑 Auto-refresh stopped');
    }
  }

  loadCurrentTrips(): void {
    if (this.isLoadingCurrent) return;

    this.isLoadingCurrent = true;
    console.log('📥 Loading current trips...');

    this.tripService.getCurrentTrips().subscribe({
      next: data => {
        this.currentTrips = Array.isArray(data) ? data : [];
        this.isLoadingCurrent = false;
        console.log(`✅ Loaded ${this.currentTrips.length} current trips for driver ${this.driverId}`);
        
        // Enhanced debugging for customer ID issues
        if (this.currentTrips.length > 0) {
          console.log('🔍 DETAILED CURRENT TRIPS ANALYSIS:');
          this.currentTrips.forEach((trip, index) => {
            console.log(`Trip ${index + 1}:`, {
              id: trip.id,
              passengerName: trip.passengerName,
              user_id: trip.user_id,
              customer_id: trip.customer_id,
              userId: trip.userId,
              customerId: trip.customerId,
              all_fields: Object.keys(trip)
            });
          });
        }
      },
      error: err => {
        console.error('❌ Error loading current trips:', err);
        this.isLoadingCurrent = false;
        this.currentTrips = [];
        
        if (err.status === 401) {
          this.handleAuthError();
        }
      }
    });
  }

  loadTripRequests(): void {
    if (this.isLoadingRequests) return;

    this.isLoadingRequests = true;
    const filterStatus = this.filterByDriver ? 'driver-specific filtered' : 'all available';
    console.log(`📥 Loading ${filterStatus} trip requests...`);

    this.tripService.getTripRequests(this.filterByDriver, this.showAllRequests).subscribe({
      next: data => {
        // Handle the response from our secured backend
        this.tripRequests = Array.isArray(data) ? data : [];
        this.isLoadingRequests = false;
        
        const filterText = this.filterByDriver ? 'filtered for you' : 'available to all drivers';
        console.log(`✅ Loaded ${this.tripRequests.length} trip requests (${filterText})`);
        console.log('🔒 Security: Only showing unassigned pending rides');

        // Show info message if no requests available
        if (this.tripRequests.length === 0 && this.activeTab === 'requests') {
          const noRequestsMsg = this.filterByDriver 
            ? 'No trip requests match your preferences. Try viewing all available requests.'
            : 'No trip requests available. New requests will appear automatically.';
          this.showInfoMessage(noRequestsMsg);
        } else if (this.tripRequests.length > 0) {
          this.clearMessages();
        }
      },
      error: err => {
        console.error('❌ Error loading trip requests:', err);
        this.isLoadingRequests = false;
        this.tripRequests = [];

        if (err.status === 401) {
          this.handleAuthError();
        } else {
          this.showErrorMessage('Failed to load trip requests. Please check your connection.');
        }
      }
    });
  }

  loadTripHistory(): void {
    if (this.isLoadingHistory) return;

    this.isLoadingHistory = true;
    console.log('📥 Loading trip history...');

    this.tripService.getTripHistory().subscribe({
      next: data => {
        this.tripHistory = Array.isArray(data) ? data : [];
        this.isLoadingHistory = false;
        console.log(`✅ Loaded ${this.tripHistory.length} historical trips for driver ${this.driverId}`);
      },
      error: err => {
        console.error('❌ Error loading trip history:', err);
        this.isLoadingHistory = false;
        this.tripHistory = [];

        if (err.status === 401) {
          this.handleAuthError();
        }
      }
    });
  }

  accept(request: any): void {
    if (!request || !request.id) {
      this.showErrorMessage('Invalid trip request');
      return;
    }

    const confirmMessage = `Accept trip from ${request.passengerName}?\n\nRoute: ${request.pickupLocation} → ${request.destination}\nFare: $${request.fareEstimate}`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    console.log(`🚗 Driver ${this.driverId} accepting trip ${request.id}`);

    this.tripService.acceptTrip(request).subscribe({
      next: resp => {
        console.log('✅ Trip accepted successfully:', resp);
        this.showSuccessMessage(`Trip accepted! You are now assigned to ${request.passengerName}'s trip.`);
        
        // Refresh all lists to reflect the change
        this.loadTripRequests(); // This will remove the accepted trip from available requests
        this.loadCurrentTrips(); // This will show the newly accepted trip
        
        // Switch to current trips tab
        this.activeTab = 'current';
      },
      error: err => {
        console.error('❌ Accept trip failed:', err);
        
        if (err.status === 400) {
          this.showErrorMessage('This trip is no longer available. Another driver may have accepted it.');
        } else if (err.status === 401) {
          this.handleAuthError();
        } else {
          this.showErrorMessage('Could not accept trip. Please try again.');
        }

        // Refresh the requests list to show current state
        this.loadTripRequests();
      }
    });
  }

  decline(request: any): void {
    // For available requests, we don't need to call an API
    // Just refresh the list and show a message
    console.log(`Driver ${this.driverId} declined trip ${request.id}`);
    this.showInfoMessage('Request declined. It remains available for other drivers.');
    
    // Optional: Remove from local list temporarily for better UX
    this.tripRequests = this.tripRequests.filter(r => r.id !== request.id);
    
    // Refresh after a delay to get the updated list
    setTimeout(() => {
      this.loadTripRequests();
    }, 2000);
  }

  // Enhanced price modal functionality
  openPriceModal(trip: any): void {
    console.log('💰 Opening price modal for trip:', trip.id);
    this.selectedTrip = trip;
    this.newPrice = trip.fareEstimate || trip.fare;
    this.priceMessage = '';
    this.showPriceModal = true;
  }

  closePriceModal(): void {
    this.showPriceModal = false;
    this.selectedTrip = null;
    this.newPrice = 0;
    this.priceMessage = '';
  }

  submitPriceOffer(): void {
    if (!this.selectedTrip || this.newPrice <= 0) {
      alert('Please enter a valid price');
      return;
    }

    if (this.newPrice <= this.selectedTrip.fareEstimate) {
      alert('New price must be higher than the original fare');
      return;
    }

    console.log(`💰 Submitting price offer: ${this.newPrice} for trip ${this.selectedTrip.id}`);

    this.tripService.updateRidePrice(
      this.selectedTrip.id, 
      this.newPrice, 
      this.priceMessage || 'Driver price adjustment'
    ).subscribe({
      next: resp => {
        console.log('✅ Price offer sent successfully:', resp);
        this.showSuccessMessage(`Price offer of ${this.newPrice} sent to customer!`);
        this.closePriceModal();
        this.loadTripRequests();
      },
      error: err => {
        console.error('❌ Price offer failed:', err);
        this.showErrorMessage('Failed to send price offer. Please try again.');
      }
    });
  }

  startTrip(trip: any): void {
    if (!confirm(`Start trip with ${trip.passengerName}?`)) return;

    console.log(`🏁 Starting trip ${trip.id}`);

    this.tripService.startTrip(trip.id).subscribe({
      next: resp => {
        console.log('✅ Trip started:', resp);
        this.showSuccessMessage('Trip started! Drive safely.');
        this.loadCurrentTrips();
      },
      error: err => {
        console.error('❌ Start trip failed:', err);
        this.showErrorMessage('Could not start trip. Please try again.');
      }
    });
  }

  completeTrip(trip: any): void {
    if (!confirm(`Mark trip with ${trip.passengerName} as completed?`)) return;

    console.log(`🏁 Completing trip ${trip.id}`);

    this.tripService.completeTrip(trip.id).subscribe({
      next: resp => {
        console.log('✅ Trip completed:', resp);
        this.showSuccessMessage('Trip completed successfully! You are now available for new trips.');
        this.loadCurrentTrips();
        this.loadTripHistory();
      },
      error: err => {
        console.error('❌ Complete trip failed:', err);
        this.showErrorMessage('Could not complete trip. Please try again.');
      }
    });
  }

  cancelCurrentTrip(trip: any): void {
    const reason = prompt('Please enter cancellation reason (required):');
    if (!reason || reason.trim().length < 5) {
      alert('Please provide a valid reason (at least 5 characters)');
      return;
    }

    console.log(`❌ Cancelling trip ${trip.id} - Reason: ${reason}`);

    this.tripService.cancelCurrentTrip(trip.id, reason.trim()).subscribe({
      next: resp => {
        console.log('✅ Trip cancelled:', resp);
        this.showSuccessMessage('Trip cancelled. You are now available for new trips.');
        this.loadCurrentTrips();
        this.loadTripHistory();
      },
      error: err => {
        console.error('❌ Cancel trip failed:', err);
        this.showErrorMessage('Could not cancel trip. Please try again.');
      }
    });
  }

  setActiveTab(tab: string): void {
    console.log(`📋 Switching to tab: ${tab}`);
    this.activeTab = tab;
    this.clearMessages();

    // Load data if not already loaded
    if (tab === 'requests' && this.tripRequests.length === 0 && !this.isLoadingRequests) {
      this.loadTripRequests();
    } else if (tab === 'current' && this.currentTrips.length === 0 && !this.isLoadingCurrent) {
      this.loadCurrentTrips();
    } else if (tab === 'history' && this.tripHistory.length === 0 && !this.isLoadingHistory) {
      this.loadTripHistory();
    }
  }

  getStatusBadgeClass(status: string): string {
    switch(status?.toLowerCase()) {
      case 'pending': return 'badge-warning';
      case 'confirmed': return 'badge-info';
      case 'in_progress': return 'badge-primary';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  // Helper methods for better UX
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  }

  // Track by function for performance
  trackByTripId(index: number, trip: any): any {
    return trip ? trip.id : index;
  }

  // Message handling
  showSuccessMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    console.log('✅ Success:', message);
    setTimeout(() => this.successMessage = '', 5000);
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    console.error('❌ Error:', message);
  }

  showInfoMessage(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    console.log('ℹ️ Info:', message);
    setTimeout(() => this.successMessage = '', 8000);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Handle authentication errors
  handleAuthError(): void {
    console.error('❌ Authentication expired');
    this.showErrorMessage('Session expired. Please log in again.');
    localStorage.removeItem('authToken');
    localStorage.removeItem('driverId');
    setTimeout(() => {
      this.router.navigate(['/driver-auth']);
    }, 2000);
  }

  // Manual refresh functionality
  refreshAllData(): void {
    console.log('🔄 Manual refresh triggered');
    this.clearMessages();
    this.showInfoMessage('Refreshing data...');
    
    this.loadTripRequests();
    this.loadCurrentTrips();
    this.loadTripHistory();
  }

  // Toggle filtering methods
  toggleFilterByDriver(): void {
    this.filterByDriver = !this.filterByDriver;
    console.log(`🔄 Toggling driver filter: ${this.filterByDriver ? 'ON' : 'OFF'}`);
    this.loadTripRequests();
  }

  toggleShowAllRequests(): void {
    this.showAllRequests = !this.showAllRequests;
    console.log(`🔄 Toggling show all: ${this.showAllRequests ? 'ON' : 'OFF'}`);
    this.loadTripRequests();
  }

  getFilterStatusText(): string {
    if (this.filterByDriver) {
      return this.showAllRequests ? 'Showing relevant requests' : 'Showing recent relevant requests';
    }
    return 'Showing all available requests';
  }

  // Check connection status
  isOnline(): boolean {
    return navigator.onLine;
  }
  getConnectionStatus(): string {
    return this.isOnline() ? 'Online' : 'Offline';
  }
  getConnectionStatusClass(): string {
    return this.isOnline() ? 'text-success' : 'text-danger';
  }
  getConnectionStatusIcon(): string {
    return this.isOnline() ? '✅' : '❌';
  }
  getConnectionStatusMessage(): string {
    return this.isOnline() ? 'You are online' : 'You are offline. Some features may be limited.';
  }
  getConnectionStatusTooltip(): string {
    return this.isOnline() ? 'Click to refresh data' : 'Reconnect to the internet to refresh data';
  }
  onConnectionStatusClick(): void {
    if (this.isOnline()) {
      this.refreshAllData();
    } else {
      alert('Please check your internet connection and try again.');
    }
  }
  // Get driver name for display
  getDriverName(): string {
    return this.driverName || 'Driver';
  }
  // Get driver ID for API calls
  getDriverId(): string | null {
    return this.driverId;
  }
  // Get driver profile picture URL
  getDriverProfilePicture(): string {
    return `https://api.example.com/drivers/${this.driverId}/profile-picture`; // Replace with actual API endpoint
  }

  // Get driver rating
  getDriverRating(): number {
    // Placeholder logic, replace with actual rating retrieval
    return 4.5; // Example rating
  }
  // Get driver vehicle information
  getDriverVehicleInfo(): string {
    // Placeholder logic, replace with actual vehicle info retrieval
    return 'Toyota Camry 2020'; // Example vehicle info
  }
  // Get driver license plate number
  getDriverLicensePlate(): string {
    // Placeholder logic, replace with actual license plate retrieval
    return 'ABC-1234'; // Example license plate
  }
  // Get driver phone number
  getDriverPhoneNumber(): string {
    // Placeholder logic, replace with actual phone number retrieval
    return '+1 (555) 123-4567'; // Example phone number
  }

  // Message customer functionality
  messageCustomer(userId: number): void {
    if (!userId || userId === 0) {
      this.showErrorMessage('Customer information not available. Cannot send message.');
      return;
    }
    
    console.log(`💬 Navigating to messaging with customer ID: ${userId}`);
    // Navigate to messaging component with customer ID
    this.router.navigate(['/messaging', userId]);
  }

  // Helper method to get customer ID from trip request
  getCustomerIdFromRequest(request: any): number {
    // Try different possible property names for customer ID
    const customerId = request.user_id || request.customer_id || request.userId || request.customerId;
    
    if (customerId) {
      console.log(`✅ Found customer ID ${customerId} for request:`, request.passengerName || 'Unknown');
      return customerId;
    }
    
    // Log warning if no customer ID found
    console.warn('⚠️ No customer ID found in request:', request);
    this.showErrorMessage('Customer information not available for this request');
    return 0; // Return 0 instead of defaulting to 2
  }

  // Helper method to get customer ID from current trip
  getCustomerIdFromTrip(trip: any): number {
    // Try different possible property names for customer ID
    const customerId = trip.user_id || trip.customer_id || trip.userId || trip.customerId || trip.passenger_id || trip.passengerId;
    
    if (customerId) {
      console.log(`✅ Found customer ID ${customerId} for trip:`, trip.passengerName || 'Unknown');
      return customerId;
    }
    
    // Log warning if no customer ID found
    console.warn('⚠️ No customer ID found in trip:', trip);
    this.showErrorMessage('Customer information not available for this trip');
    return 0; // Return 0 instead of defaulting to 2
  }

  // Debug method to analyze trip data structure
  debugTripData(): void {
    console.log('\n=== 🐛 DEBUGGING TRIP DATA STRUCTURE ===');
    console.log('Driver ID:', this.driverId);
    console.log('Driver Name:', this.driverName);
    
    console.log('\n📊 CURRENT TRIPS (' + this.currentTrips.length + '):', this.currentTrips);
    if (this.currentTrips.length > 0) {
      console.log('First current trip fields:', Object.keys(this.currentTrips[0]));
      console.log('First current trip data:', this.currentTrips[0]);
      
      const testTrip = this.currentTrips[0];
      console.log('Testing customer ID extraction for current trip:');
      console.log('- user_id:', testTrip.user_id);
      console.log('- customer_id:', testTrip.customer_id);
      console.log('- userId:', testTrip.userId);
      console.log('- customerId:', testTrip.customerId);
      console.log('- passenger_id:', testTrip.passenger_id);
      console.log('- passengerId:', testTrip.passengerId);
      
      const extractedId = this.getCustomerIdFromTrip(testTrip);
      console.log('Extracted customer ID:', extractedId);
    }
    
    console.log('\n📋 TRIP REQUESTS (' + this.tripRequests.length + '):', this.tripRequests);
    if (this.tripRequests.length > 0) {
      console.log('First trip request fields:', Object.keys(this.tripRequests[0]));
      console.log('First trip request data:', this.tripRequests[0]);
      
      const testRequest = this.tripRequests[0];
      console.log('Testing customer ID extraction for trip request:');
      console.log('- user_id:', testRequest.user_id);
      console.log('- customer_id:', testRequest.customer_id);
      console.log('- userId:', testRequest.userId);
      console.log('- customerId:', testRequest.customerId);
      
      const extractedId = this.getCustomerIdFromRequest(testRequest);
      console.log('Extracted customer ID:', extractedId);
    }
    
    console.log('\n📜 TRIP HISTORY (' + this.tripHistory.length + '):', this.tripHistory);
    if (this.tripHistory.length > 0) {
      console.log('First trip history fields:', Object.keys(this.tripHistory[0]));
      console.log('First trip history data:', this.tripHistory[0]);
    }
    
    console.log('\n=== END DEBUGGING ===\n');
  }

  // Test method to create sample trip data with proper customer ID
  createTestTripData(): void {
    console.log('🧪 Creating test trip data with proper customer ID...');
    
    // Create test current trip with proper customer ID
    const testCurrentTrip = {
      id: 999,
      user_id: 5, // Proper customer ID
      customerId: 5, // Alternative field
      passengerName: 'Test Customer',
      pickupLocation: 'Test Pickup Location',
      destination: 'Test Destination',
      fare: 1500,
      status: 'confirmed',
      assignedAt: new Date().toISOString()
    };
    
    // Add to current trips if not already there
    if (!this.currentTrips.find(trip => trip.id === 999)) {
      this.currentTrips.unshift(testCurrentTrip);
      console.log('✅ Test trip added to current trips');
    }
    
    // Test customer ID extraction
    const extractedId = this.getCustomerIdFromTrip(testCurrentTrip);
    console.log('Test customer ID extraction result:', extractedId);
    
    if (extractedId > 0) {
      console.log('✅ Customer ID extraction working correctly!');
    } else {
      console.error('❌ Customer ID extraction failed!');
    }
  }

}