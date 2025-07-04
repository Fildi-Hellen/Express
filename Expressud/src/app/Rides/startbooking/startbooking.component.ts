import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RideService, RideRequest, Driver, Ride } from '../../Services/ride.service';

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  coordinates: {lat: number, lng: number};
}

@Component({
  selector: 'app-startbooking',
  templateUrl: './startbooking.component.html',
  styleUrls: ['./startbooking.component.css']
})
export class StartbookingComponent implements OnInit {
  // Form data
  rideForm: RideRequest = {
    ride_type: 'standard',
    pickup_location: '',
    destination: '',
    fare: 0,
    currency: 'RWF',
    passengers: 1
  };

  // UI State
  isLoading = false;
  showDrivers = false;
  availableDrivers: Driver[] = [];
  selectedDriver: Driver | null = null;
  estimatedFare = 0;
  currentRide: Ride | null = null;

  // Options
  rideTypes = [
    { value: 'standard', label: 'Standard', icon: '🚗', multiplier: 1 },
    { value: 'premium', label: 'Premium', icon: '🚙', multiplier: 1.5 },
    { value: 'xl', label: 'XL (6 seats)', icon: '🚐', multiplier: 2 }
  ];

  passengerOptions = [1, 2, 3, 4, 5, 6];

  // Sample location suggestions (in real app, this would come from a map service)
  locationSuggestions: LocationSuggestion[] = [
    { id: '1', name: 'Kigali Airport', address: 'Kigali International Airport', coordinates: {lat: -1.9686, lng: 30.1394} },
    { id: '2', name: 'City Center', address: 'Downtown Kigali', coordinates: {lat: -1.9441, lng: 30.0619} },
    { id: '3', name: 'Kimironko Market', address: 'Kimironko, Kigali', coordinates: {lat: -1.9355, lng: 30.1108} },
    { id: '4', name: 'Nyabugogo Bus Station', address: 'Nyabugogo, Kigali', coordinates: {lat: -1.9706, lng: 30.0581} }
  ];

  steps = [
    {
      icon: '/assets/img/courier/fare.png',
      title: 'Offer your fare',
      description: "Agree, bargain, decline – it's your choice"
    },
    {
      icon: '/assets/img/courier/bus-driver.png',
      title: 'Choose a driver',
      description: 'Compare drivers by ratings and completed rides'
    },
    {
      icon: '/assets/img/courier/encrypted.png',
      title: 'Feel secure in your choice',
      description: 'We verify driver documents and identities before they can offer rides'
    }
  ];

  imageSrc = '/assets/img/courier/uber.gif';

  constructor(
    private rideService: RideService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.calculateEstimatedFare();
  }

  /**
   * Calculate estimated fare based on distance and ride type
   */
  calculateEstimatedFare(): void {
    if (this.rideForm.pickup_location && this.rideForm.destination) {
      // Basic fare calculation (in real app, use actual distance)
      const baseFare = 2000; // Base fare in RWF
      const distanceMultiplier = Math.random() * 3 + 1; // Simulate distance
      const typeMultiplier = this.rideTypes.find(t => t.value === this.rideForm.ride_type)?.multiplier || 1;
      
      this.estimatedFare = Math.round(baseFare * distanceMultiplier * typeMultiplier);
      this.rideForm.fare = this.estimatedFare;
    }
  }

  /**
   * Handle location selection
   */
  selectLocation(location: LocationSuggestion, type: 'pickup' | 'destination'): void {
    if (type === 'pickup') {
      this.rideForm.pickup_location = location.name;
    } else {
      this.rideForm.destination = location.name;
    }
    this.calculateEstimatedFare();
  }

  /**
   * Handle ride type change
   */
  onRideTypeChange(): void {
    this.calculateEstimatedFare();
  }

  /**
   * Validate form before submission
   */
  isFormValid(): boolean {
    return !!(
      this.rideForm.pickup_location &&
      this.rideForm.destination &&
      this.rideForm.passengers > 0 &&
      this.rideForm.fare > 0
    );
  }

  /**
   * Search for available drivers
   */
  async searchDrivers(): Promise<void> {
    if (!this.isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    this.isLoading = true;
    
    try {
      const response = await this.rideService.createRideAndFindDrivers(this.rideForm).toPromise();
      
      if (response) {
        this.currentRide = response.ride;
        this.availableDrivers = response.drivers.sort((a, b) => a.distance - b.distance);
        this.showDrivers = true;
        this.rideService.setCurrentRide(this.currentRide);
        
        alert(`Found ${this.availableDrivers.length} available drivers!`);
      }
    } catch (error: any) {
      console.error('Error searching for drivers:', error);
      alert(error.error?.message || 'Failed to find drivers. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Select a driver for the ride
   */
  selectDriver(driver: Driver): void {
    this.selectedDriver = driver;
  }

  /**
   * Confirm ride with selected driver
   */
  async confirmRide(): Promise<void> {
    if (!this.selectedDriver || !this.currentRide) {
      alert('Please select a driver first');
      return;
    }

    this.isLoading = true;

    try {
      const response = await this.rideService.confirmRide(this.currentRide.id, this.selectedDriver.id).toPromise();
      
      if (response) {
        alert('Ride confirmed! Driver will arrive shortly.');
        this.router.navigate(['/user-rides']);
      }
    } catch (error: any) {
      console.error('Error confirming ride:', error);
      alert(error.error?.message || 'Failed to confirm ride. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Cancel current ride search
   */
  cancelSearch(): void {
    this.showDrivers = false;
    this.availableDrivers = [];
    this.selectedDriver = null;
    this.currentRide = null;
    this.rideService.setCurrentRide(null);
  }

  /**
   * Get star rating display
   */
  getStarRating(rating: number): string {
    const stars = Math.round(rating);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  }

  /**
   * Format estimated time
   */
  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  /**
   * Get price class for styling
   */
  getPriceClass(price: number): string {
    if (price <= this.estimatedFare) return 'text-success';
    if (price <= this.estimatedFare * 1.2) return 'text-warning';
    return 'text-danger';
  }
}
