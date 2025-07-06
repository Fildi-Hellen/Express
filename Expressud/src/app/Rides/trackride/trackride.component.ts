import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RideService, Ride, Driver } from '../../Services/ride.service';
import { Subject, takeUntil, interval } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

interface UserStats {
  totalRides: number;
  totalSpent: number;
  averageRating: number;
  favoriteDriver: string;
}

interface Order {
  id: number;
  restaurant_name: string;
  status: string;
  total: number;
  created_at: string;
}

@Component({
  selector: 'app-trackride',
  templateUrl: './trackride.component.html',
  styleUrls: ['./trackride.component.css']
})
export class TrackRideComponet implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Current ride tracking
  currentRide: Ride | null = null;
  
  // Rides data
  activeRides: Ride[] = [];
  rideHistory: Ride[] = [];
  filteredHistory: Ride[] = [];
  
  // Orders data
  activeOrders: Order[] = [];
  
  // UI state
  isLoadingRides = false;
  isUpdatingRide = false;
  isCancelling = false;
  
  // Filters and pagination
  historyFilter = 'all';
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  
  // Active rides pagination
  activeRidesCurrentPage = 1;
  activeRidesTotalPages = 1;
  activeRidesPerPage = 5;
  
  // User statistics
  userStats: UserStats = {
    totalRides: 0,
    totalSpent: 0,
    averageRating: 0,
    favoriteDriver: 'N/A'
  };

  // Debug information
  lastApiCallTime: string = 'Never';
  
  // Tab management
  activeTabSection: string = 'pending'; // 'pending', 'confirmed', 'in_progress', 'completed'
  
  // Ride arrays by status
  pendingRides: Ride[] = [];
  confirmedRides: Ride[] = [];
  inProgressRides: Ride[] = [];
  completedRides: Ride[] = [];

  constructor(
    private rideService: RideService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadActiveRides();
    this.loadRideHistory();
    this.loadActiveOrders();
    this.loadUserStats();
    this.setupRealTimeUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load active rides with enhanced error handling
   */
  loadActiveRides(): void {
    this.isLoadingRides = true;
    this.lastApiCallTime = this.formatTime(this.getCurrentTime());
    console.log('🔄 Loading and categorizing rides by status...');
    
    this.rideService.getUserRides()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rides: Ride[]) => {
          console.log('📥 Received rides data:', rides);
          
          // Clear existing arrays
          this.pendingRides = [];
          this.confirmedRides = [];
          this.inProgressRides = [];
          this.completedRides = [];
          this.activeRides = [];
          
          // Categorize rides by status
          rides.forEach(ride => {
            switch(ride.status?.toLowerCase()) {
              case 'pending':
                this.pendingRides.push(ride);
                this.activeRides.push(ride);
                break;
              case 'confirmed':
                this.confirmedRides.push(ride);
                this.activeRides.push(ride);
                break;
              case 'started':
              case 'in_progress':
                this.inProgressRides.push(ride);
                this.activeRides.push(ride);
                break;
              case 'completed':
                this.completedRides.push(ride);
                this.rideHistory.push(ride); // Also add to history
                break;
              case 'cancelled':
                this.completedRides.push(ride); // Cancelled rides go to completed tab
                this.rideHistory.push(ride);
                break;
              default:
                console.warn(`Unknown ride status: ${ride.status}`);
                break;
            }
          });
          
          console.log(`🎯 Categorized rides:`);
          console.log(`   Pending: ${this.pendingRides.length}`);
          console.log(`   Confirmed: ${this.confirmedRides.length}`);
          console.log(`   In Progress: ${this.inProgressRides.length}`);
          console.log(`   Completed: ${this.completedRides.length}`);
          
          // Update pagination
          this.updateActiveRidesPagination();
          
          // Set current ride (in progress or confirmed)
          this.currentRide = this.inProgressRides[0] || this.confirmedRides[0] || null;
          
          if (this.currentRide) {
            console.log('🚗 Current ride set:', this.currentRide);
          } else {
            console.log('🙅‍♂️ No current active ride found');
          }
          
          this.isLoadingRides = false;
          this.lastApiCallTime = this.formatTime(this.getCurrentTime());
          
          // Update user stats
          this.loadUserStats();
        },
        error: (error) => {
          console.error('❌ Error loading rides:', error);
          this.isLoadingRides = false;
          this.pendingRides = [];
          this.confirmedRides = [];
          this.inProgressRides = [];
          this.completedRides = [];
          this.activeRides = [];
          this.currentRide = null;
          this.lastApiCallTime = `Error: ${this.formatTime(this.getCurrentTime())}`;
          
          // Show user-friendly error message
          if (error.status === 401) {
            this.showErrorMessage('Please log in to view your rides');
          } else if (error.status === 0) {
            this.showErrorMessage('Cannot connect to server. Please check your internet connection.');
          } else {
            this.showErrorMessage('Failed to load rides. Please try again.');
          }
        }
      });
  }

  /**
   * Update active rides pagination
   */
  updateActiveRidesPagination(): void {
    this.activeRidesTotalPages = Math.ceil(this.activeRides.length / this.activeRidesPerPage);
    if (this.activeRidesCurrentPage > this.activeRidesTotalPages) {
      this.activeRidesCurrentPage = 1;
    }
  }

  /**
   * Get paginated active rides
   */
  getPaginatedActiveRides(): Ride[] {
    const startIndex = (this.activeRidesCurrentPage - 1) * this.activeRidesPerPage;
    const endIndex = startIndex + this.activeRidesPerPage;
    return this.activeRides.slice(startIndex, endIndex);
  }

  /**
   * Change active rides page
   */
  changeActiveRidesPage(page: number): void {
    if (page >= 1 && page <= this.activeRidesTotalPages) {
      this.activeRidesCurrentPage = page;
    }
  }

  /**
   * Get active rides page numbers
   */
  getActiveRidesPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.activeRidesTotalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Load ride history with enhanced error handling
   */
  loadRideHistory(): void {
    console.log('📋 Loading ride history...');
    
    this.rideService.getUserRides()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rides: Ride[]) => {
          console.log('📥 Received rides data for history:', rides);
          
          this.rideHistory = rides.filter(ride => {
            const isHistorical = ['completed', 'cancelled'].includes(ride.status);
            console.log(`Ride ${ride.id} status: ${ride.status}, historical: ${isHistorical}`);
            return isHistorical;
          });
          
          console.log(`📋 Filtered ${this.rideHistory.length} historical rides`);
          
          this.filterHistory();
          this.loadUserStats(); // Recalculate stats after loading history
        },
        error: (error) => {
          console.error('❌ Error loading ride history:', error);
          this.rideHistory = [];
          this.filteredHistory = [];
          this.showErrorMessage('Failed to load ride history');
        }
      });
  }

  /**
   * Load active orders (mock data for now)
   */
  loadActiveOrders(): void {
    // Mock data - replace with actual order service call
    this.activeOrders = [
      {
        id: 1001,
        restaurant_name: 'Pizza Palace',
        status: 'preparing',
        total: 2500,
        created_at: new Date().toISOString()
      },
      {
        id: 1002,
        restaurant_name: 'Burger King',
        status: 'out_for_delivery',
        total: 1800,
        created_at: new Date(Date.now() - 1800000).toISOString()
      }
    ];
  }

  /**
   * Load user statistics
   */
  loadUserStats(): void {
    // Calculate from ride history
    this.userStats.totalRides = this.rideHistory.length;
    this.userStats.totalSpent = this.rideHistory.reduce((sum, ride) => sum + ride.fare, 0);
    
    const completedRides = this.rideHistory.filter(ride => ride.status === 'completed');
    this.userStats.averageRating = completedRides.length > 0 
      ? completedRides.reduce((sum, ride) => sum + (ride.driver?.rating || 0), 0) / completedRides.length 
      : 0;
    
    // Find most frequent driver
    const driverCounts: {[key: string]: number} = {};
    completedRides.forEach(ride => {
      if (ride.driver?.name) {
        driverCounts[ride.driver.name] = (driverCounts[ride.driver.name] || 0) + 1;
      }
    });
    
    this.userStats.favoriteDriver = Object.keys(driverCounts).length > 0 
      ? Object.keys(driverCounts).reduce((a, b) => driverCounts[a] > driverCounts[b] ? a : b)
      : 'N/A';
  }

  /**
   * Setup real-time updates
   */
  setupRealTimeUpdates(): void {
    // Poll for updates every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.currentRide) {
          this.trackRideUpdates(this.currentRide.id);
        }
      });
  }

  /**
   * Track ride updates
   */
  trackRideUpdates(rideId: number): void {
    this.rideService.trackRide(rideId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ride: Ride) => {
          // Update current ride
          if (this.currentRide && this.currentRide.id === ride.id) {
            this.currentRide = ride;
          }
          
          // Update in active rides list
          const index = this.activeRides.findIndex(r => r.id === ride.id);
          if (index !== -1) {
            this.activeRides[index] = ride;
          }
        },
        error: (error) => {
          console.error('Error tracking ride:', error);
        }
      });
  }

  /**
   * Cancel a ride
   */
  cancelRide(rideId: number): void {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    this.isCancelling = true;
    
    this.rideService.cancelRide(rideId, reason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.showSuccessMessage('Ride cancelled successfully');
          this.loadActiveRides();
          this.isCancelling = false;
        },
        error: (error) => {
          console.error('Error cancelling ride:', error);
          this.showErrorMessage('Failed to cancel ride');
          this.isCancelling = false;
        }
      });
  }

  /**
   * Track ride on map
   */
  trackRide(rideId: number): void {
    // Navigate to tracking page or open tracking modal
    this.router.navigate(['/track-ride', rideId]);
  }

  /**
   * Contact driver
   */
  contactDriver(): void {
    if (this.currentRide && this.currentRide.driver) {
      // Open contact modal or initiate call
      alert(`Calling ${this.currentRide.driver.name} at ${this.currentRide.driver.phone}`);
    }
  }

  /**
   * View ride details
   */
  viewRideDetails(ride: Ride): void {
    // Show detailed ride information in a formatted alert
    const details = `
RIDE DETAILS
============

Ride ID: #${ride.id}
Status: ${ride.status}
Date: ${this.formatDate(ride.created_at)}

TRIP INFO:
----------
From: ${ride.pickup_location}
To: ${ride.destination}
Passengers: ${ride.passengers}
Ride Type: ${ride.ride_type || 'Standard'}
Fare: ${this.formatCurrency(ride.fare)}

DRIVER INFO:
------------
Name: ${ride.driver?.name || 'Not assigned'}
Vehicle: ${ride.driver?.vehicle_model || 'N/A'}
License: ${ride.driver?.license_plate || 'N/A'}
Rating: ${ride.driver?.rating || 'N/A'}/5

${ride.eta ? `ETA: ${ride.eta}` : ''}
${ride.cancellation_reason ? `Cancellation Reason: ${ride.cancellation_reason}` : ''}`;
    
    alert(details);
  }

  /**
   * Filter ride history
   */
  filterHistory(): void {
    let filtered = [...this.rideHistory];
    
    switch (this.historyFilter) {
      case 'completed':
        filtered = filtered.filter(ride => ride.status === 'completed');
        break;
      case 'cancelled':
        filtered = filtered.filter(ride => ride.status === 'cancelled');
        break;
      case 'this_week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(ride => new Date(ride.created_at) >= weekAgo);
        break;
      case 'this_month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        filtered = filtered.filter(ride => new Date(ride.created_at) >= monthAgo);
        break;
    }
    
    this.filteredHistory = filtered;
    this.totalPages = Math.ceil(this.filteredHistory.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  /**
   * Change page
   */
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Get page numbers
   */
  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Export history
   */
  exportHistory(): void {
    const csvContent = this.convertToCSV(this.filteredHistory);
    this.downloadCSV(csvContent, 'ride_history.csv');
  }

  /**
   * Convert to CSV
   */
  private convertToCSV(data: any[]): string {
    const headers = ['Date', 'From', 'To', 'Driver', 'Status', 'Fare'];
    const rows = data.map(ride => [
      this.formatDate(ride.created_at),
      ride.pickup_location,
      ride.destination,
      ride.driver?.name || 'N/A',
      ride.status,
      ride.fare
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Download CSV
   */
  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Book new ride
   */
  bookNewRide(): void {
    this.router.navigate(['/bookings']);
  }

  /**
   * Refresh rides
   */
  refreshRides(): void {
    this.loadActiveRides();
    this.loadRideHistory();
  }

  /**
   * Contact support
   */
  supportContact(): void {
    // Make this functional with actual support contact
    const supportNumber = '+250-XXX-XXXX';
    const supportEmail = 'support@expressud.com';
    
    const choice = confirm(`Contact Support:\n\nCall: ${supportNumber}\nEmail: ${supportEmail}\n\nPress OK to call or Cancel to copy email`);
    
    if (choice) {
      // Try to initiate call
      window.open(`tel:${supportNumber}`);
    } else {
      // Copy email to clipboard
      navigator.clipboard.writeText(supportEmail).then(() => {
        this.showSuccessMessage('Support email copied to clipboard!');
      }).catch(() => {
        this.showSuccessMessage(`Support email: ${supportEmail}`);
      });
    }
  }

  /**
   * Track order
   */
  trackOrder(orderId: number): void {
    // Make this functional by showing order status
    const order = this.activeOrders.find(o => o.id === orderId);
    if (order) {
      this.showSuccessMessage(`Tracking Order #${orderId}:\n\nStatus: ${order.status}\nRestaurant: ${order.restaurant_name}\nTotal: ${this.formatCurrency(order.total)}`);
    } else {
      this.showErrorMessage('Order not found');
    }
  }

  /**
   * Order food
   */
  orderFood(): void {
    // Navigate to restaurants if available, otherwise show message
    try {
      this.router.navigate(['/restaurants']);
    } catch (error) {
      this.showErrorMessage('Food ordering feature coming soon!');
    }
  }

  /**
   * Download receipt
   */
  downloadReceipt(ride: Ride): void {
    // Generate a simple receipt and trigger download
    const receiptContent = this.generateReceiptContent(ride);
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ride-receipt-${ride.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    this.showSuccessMessage('Receipt downloaded successfully!');
  }

  /**
   * Generate receipt content
   */
  private generateReceiptContent(ride: Ride): string {
    return `
EXPRESSUD RIDE RECEIPT
========================

Ride ID: #${ride.id}
Date: ${this.formatDate(ride.created_at)}
Status: ${ride.status}

TRIP DETAILS:
-------------
From: ${ride.pickup_location}
To: ${ride.destination}
Passengers: ${ride.passengers}
Ride Type: ${ride.ride_type}

DRIVER DETAILS:
---------------
Name: ${ride.driver?.name || 'N/A'}
Vehicle: ${ride.driver?.vehicle_model || 'N/A'}
License Plate: ${ride.driver?.license_plate || 'N/A'}
Rating: ${ride.driver?.rating || 'N/A'}/5

PAYMENT:
--------
Fare: ${this.formatCurrency(ride.fare)}
Currency: ${ride.currency || 'RWF'}

Thank you for using ExpressUD!
For support: support@expressud.com
    `;
  }

  /**
   * Rate ride
   */
  rateRide(ride: Ride): void {
    const rating = prompt('Rate this ride (1-5 stars):');
    if (rating && Number(rating) >= 1 && Number(rating) <= 5) {
      this.rideService.rateRide(ride.id, Number(rating))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.showSuccessMessage('Thank you for rating!');
            this.loadRideHistory();
          },
          error: (error) => {
            console.error('Error rating ride:', error);
            this.showErrorMessage('Failed to submit rating');
          }
        });
    }
  }

  /**
   * Get ride progress percentage
   */
  getRideProgress(status: string): number {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'started': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  }

  /**
   * Get order progress percentage
   */
  getOrderProgress(status: string): number {
    switch (status) {
      case 'confirmed': return 25;
      case 'preparing': return 50;
      case 'out_for_delivery': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  }

  /**
   * Get star rating array
   */
  getStarArray(rating: number): boolean[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars);
    }
    
    return stars;
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Format date
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Format time
   */
  formatTime(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return this.formatDate(dateString);
  }

  /**
   * Show success message
   */
  private showSuccessMessage(message: string): void {
    // Replace with actual toast service
    alert(message);
  }

  /**
   * Show error message
   */
  private showErrorMessage(message: string): void {
    // Replace with actual toast service
    alert(message);
  }

  /**
   * Test API connection manually
   */
  testApiConnection(): void {
    console.log('🧪 Testing API connection manually...');
    
    // Direct API test
    this.rideService.getUserRides().subscribe({
      next: (data) => {
        console.log('✅ Manual API test successful:', data);
        alert(`API Test Success!\n\nReceived ${data.length} rides:\n${JSON.stringify(data, null, 2)}`);
      },
      error: (error) => {
        console.error('❌ Manual API test failed:', error);
        alert(`API Test Failed!\n\nError: ${error.message}\nStatus: ${error.status}\nURL: ${error.url}`);
      }
    });
  }

  /**
   * Test debug API endpoint
   */
  testDebugApi(): void {
    console.log('🔍 Testing debug API endpoint...');
    
    this.rideService.debugUserRides().subscribe({
      next: (data) => {
        console.log('✅ Debug API test successful:', data);
        const debugInfo = data.debug_info;
        alert(`Debug API Success!\n\nUser ID: ${debugInfo.user_id}\nRaw Rides: ${debugInfo.raw_rides_count}\nRides with Driver: ${debugInfo.rides_with_driver_count}\n\nSample data in console.`);
      },
      error: (error) => {
        console.error('❌ Debug API test failed:', error);
        alert(`Debug API Failed!\n\nError: ${error.message}\nStatus: ${error.status}`);
      }
    });
  }

  /**
   * Simulate different ride statuses for testing
   */
  simulateRideStatuses(): void {
    console.log('🎭 Simulating different ride statuses for testing...');
    
    // Temporarily modify the rides array for demonstration
    if (this.activeRides.length === 0) {
      // Create mock rides for demonstration
      const mockActiveRides: Ride[] = [
        {
          id: 999,
          user_id: 2,
          driver_id: 1,
          ride_type: 'standard',
          pickup_location: 'Test Location A',
          destination: 'Test Destination A',
          fare: 15.50,
          currency: 'USD',
          passengers: 1,
          status: 'pending',
          created_at: new Date().toISOString(),
          driver: {
            id: 1,
            name: 'Test Driver',
            phone: '123-456-7890',
            vehicle_type: 'Car',
            vehicle_model: 'Toyota',
            license_plate: 'ABC-123',
            rating: 4.5,
            distance: 5,
            time: 10,
            price: 15.50,
            image: '',
            is_available: true
          }
        },
        {
          id: 998,
          user_id: 2,
          driver_id: 2,
          ride_type: 'standard',
          pickup_location: 'Test Location B',
          destination: 'Test Destination B',
          fare: 22.00,
          currency: 'USD',
          passengers: 2,
          status: 'confirmed',
          created_at: new Date().toISOString(),
          driver: {
            id: 2,
            name: 'Another Driver',
            phone: '987-654-3210',
            vehicle_type: 'SUV',
            vehicle_model: 'Honda',
            license_plate: 'XYZ-789',
            rating: 4.8,
            distance: 3,
            time: 8,
            price: 22.00,
            image: '',
            is_available: true
          }
        }
      ];
      
      this.activeRides = mockActiveRides;
      this.currentRide = mockActiveRides[1]; // Set the confirmed ride as current
      this.updateActiveRidesPagination();
      
      alert('Simulated active rides added! You should now see 2 active rides displayed.\n\nClick "Clear Simulation" to return to real data.');
      console.log('🎭 Simulated rides:', this.activeRides);
    } else {
      alert('You already have active rides. Clear simulation first or refresh the page.');
    }
  }

  /**
   * Clear simulated data and reload real data
   */
  clearSimulation(): void {
    console.log('🧹 Clearing simulation and reloading real data...');
    this.activeRides = [];
    this.currentRide = null;
    this.loadActiveRides();
    alert('Simulation cleared! Reloaded real data from API.');
  }

  /**
   * Get current timestamp for debugging
   */
  getCurrentTime(): string {
    return new Date().toISOString();
  }

  /**
   * Check authentication status
   */
  checkAuthStatus(): string {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    return `Token: ${token ? 'Present' : 'Missing'}, UserID: ${userId || 'Not set'}`;
  }

  /**
   * Get trip history count for debugging
   */
  getTripHistoryCount(): number {
    return this.rideHistory ? this.rideHistory.length : 0;
  }

  /**
   * Set active tab section
   */
  setActiveTab(tab: string): void {
    this.activeTabSection = tab;
    console.log(`📋 Switching to tab: ${tab}`);
  }

  /**
   * Get current tab rides
   */
  getCurrentTabRides(): Ride[] {
    switch(this.activeTabSection) {
      case 'pending': return this.pendingRides;
      case 'confirmed': return this.confirmedRides;
      case 'in_progress': return this.inProgressRides;
      case 'completed': return this.completedRides;
      default: return [];
    }
  }

  /**
   * Get tab title
   */
  getTabTitle(): string {
    switch(this.activeTabSection) {
      case 'pending': return 'Pending Requests';
      case 'confirmed': return 'Confirmed Rides';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed Rides';
      default: return 'Rides';
    }
  }

  /**
   * Get tab icon
   */
  getTabIcon(): string {
    switch(this.activeTabSection) {
      case 'pending': return 'fas fa-clock';
      case 'confirmed': return 'fas fa-check-circle';
      case 'in_progress': return 'fas fa-car';
      case 'completed': return 'fas fa-flag-checkered';
      default: return 'fas fa-list';
    }
  }
}
