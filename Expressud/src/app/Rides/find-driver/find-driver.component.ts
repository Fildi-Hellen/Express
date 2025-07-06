import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { trigger, transition, style, animate } from '@angular/animations';
import { DriverService } from 'src/app/Services/driver.service';
import { EchoService } from 'src/app/Services/echo.service';

interface Driver {
  id: string;
  name: string;
  image: string;
  vehicle_type: string;
  license_plate: string;
  rating: number;
  distance: number;
  time: number;
  price: number;
  trips_completed: number;
}

@Component({
  selector: 'app-find-driver',
  templateUrl: './find-driver.component.html',
  styleUrls: ['./find-driver.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateY(30px) scale(0.95)' 
        }),
        animate('300ms ease-out', style({ 
          opacity: 1, 
          transform: 'translateY(0) scale(1)' 
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ 
          opacity: 0, 
          transform: 'translateY(-20px) scale(0.98)' 
        }))
      ])
    ])
  ]
})
export class FindDriverComponent implements OnInit, OnDestroy {
  drivers: Driver[] = [];
  booking: any;
  selectedDriver: Driver | null = null;
  isLoading = true;
  isConfirming = false;
  confirmationMessage = '';
  cancellationReason = '';
  customCancelReason = '';
  showCancelForm = false;
  private echoChannel: any;

  // Predefined cancellation reasons
  cancelReasons = [
    'Driver is taking too long',
    'Changed my mind',
    'Found alternative transport',
    'Emergency situation',
    'Wrong pickup location',
    'Other'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private driverService: DriverService,
    private echoService: EchoService,
    private dialogRef: MatDialogRef<FindDriverComponent>
  ) {
    this.booking = data;
  }

  ngOnInit(): void {
    this.loadDrivers();
    this.setupRealTimeListeners();
  }

  ngOnDestroy(): void {
    this.cleanupRealTimeListeners();
  }

  private setupRealTimeListeners(): void {
    // Listen for real-time assignment events if echo service is available
    try {
      if (this.echoService && this.echoService.echo && this.booking.user_id) {
        this.echoChannel = this.echoService.listen(
          `users.${this.booking.user_id}`, 
          '.ride-assigned', 
          (evt: any) => {
            this.handleDriverAssignment(evt);
          }
        );

        // Listen for driver acceptance
        this.echoService.listen(
          `rides.${this.booking.id}`, 
          '.driver-accepted', 
          (evt: any) => {
            this.handleDriverAcceptance(evt);
          }
        );
      }
    } catch (error) {
      console.warn('Real-time updates unavailable:', error);
    }
  }

  private cleanupRealTimeListeners(): void {
    try {
      // Echo cleanup - the service doesn't have a leave method, so we'll handle it differently
      if (this.echoChannel && this.echoService?.echo) {
        // Pusher/Echo will handle cleanup automatically when component is destroyed
        this.echoChannel = null;
      }
    } catch (error) {
      console.warn('Error cleaning up real-time listeners:', error);
    }
  }

  private handleDriverAssignment(evt: any): void {
    this.confirmationMessage = `🎉 Driver ${evt.driver.name} is on the way!`;
    this.selectedDriver = evt.driver;
    this.drivers = [evt.driver];
    this.isLoading = false;
    
    // Auto-close after 5 seconds to show tracking
    setTimeout(() => {
      this.dialogRef.close({ success: true, driver: evt.driver });
    }, 5000);
  }

  private handleDriverAcceptance(evt: any): void {
    this.confirmationMessage = `✅ Ride confirmed with ${evt.driver.name}!`;
    this.isConfirming = false;
  }

  private loadDrivers(): void {
    // Map the booking data to match API expectations
    const rideData = {
      ride_type: this.booking.rideType || this.booking.ride_type,
      pickup_location: this.booking.pickupLocation || this.booking.pickup_location,
      destination: this.booking.destination,
      fare: this.booking.estimatedFare || this.booking.fare,
      currency: this.booking.currency || 'USD',
      passengers: this.booking.passengers
    };

    // Validate required fields and log for debugging
    console.log('Booking data received:', this.booking);
    console.log('Mapped ride data:', rideData);
    if (!rideData.pickup_location || !rideData.destination) {
      console.error('Missing required fields:', rideData);
      this.showErrorMessage('Pickup location and destination are required.');
      this.isLoading = false;
      return;
    }

    this.driverService.createRideAndFetchDrivers(rideData).subscribe({
      next: (response: any) => {
        // Update booking with server response
        if (response.ride) {
          this.booking = { ...this.booking, ...response.ride };
        }
        
        // Process drivers from response
        this.drivers = this.processDrivers(response.drivers || []);
        this.isLoading = false;
        
        if (this.drivers.length === 0) {
          this.scheduleRetry();
        }
      },
      error: (err: any) => {
        console.error('Error fetching drivers:', err);
        console.error('Request data:', rideData);
        this.isLoading = false;
        this.showErrorMessage('Failed to find drivers. Please try again.');
      }
    });
  }

  private processDrivers(drivers: any[]): Driver[] {
    return drivers
      .map(driver => ({
        ...driver,
        rating: Number(driver.rating) || 4.5,
        distance: Number(driver.distance) || 0,
        time: Number(driver.time) || 5,
        price: Number(driver.price) || this.booking.fare,
        trips_completed: Number(driver.trips_completed) || 100
      }))
      .sort((a, b) => {
        // Sort by distance first, then by rating
        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }
        return b.rating - a.rating;
      });
  }

  private scheduleRetry(): void {
    // Retry finding drivers after 30 seconds
    setTimeout(() => {
      if (this.drivers.length === 0 && !this.confirmationMessage) {
        this.isLoading = true;
        this.loadDrivers();
      }
    }, 30000);
  }

  selectDriver(driver: Driver): void {
    this.selectedDriver = driver;
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  orderRide(driver: Driver): void {
    if (this.isConfirming) return;
    
    this.isConfirming = true;
    this.selectedDriver = driver;

    const rideData = {
      ride_id: this.booking.id,
      driver_id: driver.id,
      final_price: driver.price,
      pickup_location: this.booking.pickup_location,
      destination: this.booking.destination
    };

    this.driverService.confirmRide(rideData).subscribe({
      next: (response: any) => {
        this.confirmationMessage = `✅ Ride confirmed with ${driver.name}! They'll be there in ${driver.time} minutes.`;
        this.isConfirming = false;
        
        // Provide success feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
        
        // Show success state for 3 seconds then close
        setTimeout(() => {
          this.dialogRef.close({ 
            success: true, 
            driver: driver,
            booking: response.ride 
          });
        }, 3000);
      },
      error: (err: any) => {
        console.error('Error confirming ride:', err);
        this.isConfirming = false;
        this.showErrorMessage(err.error?.message || 'Failed to confirm ride. Please try again.');
      }
    });
  }

  retrySearch(): void {
    this.isLoading = true;
    this.loadDrivers();
  }

  toggleCancel(): void {
    this.showCancelForm = !this.showCancelForm;
    this.cancellationReason = '';
    this.customCancelReason = '';
  }

  cancelRide(): void {
    const reason = this.cancellationReason === 'Other' ? 
      this.customCancelReason.trim() : 
      this.cancellationReason;

    if (!reason) {
      this.showErrorMessage('Please select or enter a cancellation reason.');
      return;
    }

    this.driverService.cancelRide(this.booking.id, reason).subscribe({
      next: (response: any) => {
        this.showSuccessMessage(response.message || 'Ride cancelled successfully.');
        setTimeout(() => {
          this.dialogRef.close({ cancelled: true, reason: reason });
        }, 2000);
      },
      error: (err: any) => {
        console.error('Cancel failed:', err);
        this.showErrorMessage(err.error?.message || 'Failed to cancel ride. Please try again.');
      }
    });
  }

  trackRide(): void {
    // Navigate to tracking page or show tracking modal
    this.dialogRef.close({ 
      success: true, 
      driver: this.selectedDriver,
      action: 'track'
    });
  }

  // Utility methods
  getStarArray(rating: number): boolean[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars);
    }
    
    return stars;
  }

  getPriceClass(price: number): string {
    const baseFare = this.booking.fare || 0;
    const difference = ((price - baseFare) / baseFare) * 100;
    
    if (difference <= -10) return 'low';
    if (difference >= 10) return 'high';
    return 'medium';
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/60x60/201658/ffffff?text=D';
  }

  formatTime(minutes: number): string {
    if (minutes < 1) return '< 1 min';
    if (minutes === 1) return '1 min';
    return `${Math.round(minutes)} mins`;
  }

  formatDistance(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)}km`;
  }

  private showErrorMessage(message: string): void {
    // You can implement a toast notification service here
    alert(message);
  }

  private showSuccessMessage(message: string): void {
    // You can implement a toast notification service here
    alert(message);
  }

  // Handle escape key and outside clicks
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && !this.confirmationMessage && !this.isConfirming) {
      this.dialogRef.close({ cancelled: true });
    }
  }

  // Method to get dynamic header text
  getHeaderText(): string {
    if (this.isLoading) {
      return 'Searching for drivers...';
    }
    if (this.drivers.length === 0) {
      return 'No drivers found';
    }
    if (this.confirmationMessage) {
      return 'Ride confirmed!';
    }
    return `${this.drivers.length} driver${this.drivers.length > 1 ? 's' : ''} available`;
  }

  // Method to check if any driver is selected
  isDriverSelected(): boolean {
    return !!this.selectedDriver;
  }

  // Method to get the estimated arrival time
  getEstimatedArrival(): string {
    if (this.selectedDriver) {
      const now = new Date();
      const arrival = new Date(now.getTime() + this.selectedDriver.time * 60000);
      return arrival.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  }
}
