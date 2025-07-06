import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

// Define interfaces
export interface RideType {
  value: string;
  label: string;
  icon: string;
  passengers: number;
  baseFare: number;
  perKmRate: number;
  multiplier: number;
}

export interface RouteInfo {
  distance: string;
  duration: string;
  via: string;
  polyline: string;
}

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
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
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('300ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateY(-20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class BookingsComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();
  
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;
  
  rideForm!: FormGroup;
  isLoading = false;
  estimatedFare = 0;
  pickupCoordinates: any;
  destinationCoordinates: any;
  routeInfo: RouteInfo | null = null;
  currencyCode = 'USD';

  // Location picker properties
  showLocationPicker = false;
  activeLocationInput: 'pickup' | 'destination' | null = null;
  pickerMarkerPosition: any = null;
  
  // Map properties
  map: any;
  mapInitialized = false;
  showMapView = false;
  mapMode: 'pickup' | 'destination' | null = null;
  isLoadingMap = false;
  
  // Navigation component integration
  selectedLocationFromNav: string = '';
  
  // Location suggestions
  locationSuggestions: any[] = [];
  
  // Payment methods
  paymentMethods = ['Card', 'Cash', 'Mobile Money'];

  rideTypes: RideType[] = [
    {
      value: 'standard',
      label: 'Standard',
      icon: '🚗',
      passengers: 4,
      baseFare: 5,
      perKmRate: 1.5,
      multiplier: 1.0
    },
    {
      value: 'premium',
      label: 'Premium',
      icon: '🚙',
      passengers: 4,
      baseFare: 8,
      perKmRate: 2.5,
      multiplier: 1.5
    },
    {
      value: 'xl',
      label: 'XL',
      icon: '🚐',
      passengers: 6,
      baseFare: 10,
      perKmRate: 3.0,
      multiplier: 2.0
    }
  ];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupFormWatchers();
  }

  ngAfterViewInit(): void {
    // Initialize map when view is ready
    setTimeout(() => {
      if (this.showMapView) {
        this.initializeMap();
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.rideForm = this.fb.group({
      pickupLocation: ['', [Validators.required, Validators.minLength(3)]],
      destination: ['', [Validators.required, Validators.minLength(3)]],
      rideType: ['standard', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
      paymentMethod: ['card', Validators.required]
    }, { validators: this.sameLocationValidator });
  }

  private setupFormWatchers(): void {
    this.rideForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.rideForm.get('pickupLocation')?.valid && 
            this.rideForm.get('destination')?.valid) {
          this.calculateEstimatedFare();
        }
      });
  }

  private sameLocationValidator(control: AbstractControl): ValidationErrors | null {
    const pickup = control.get('pickupLocation')?.value?.toLowerCase().trim();
    const destination = control.get('destination')?.value?.toLowerCase().trim();
    
    if (pickup && destination && pickup === destination) {
      return { sameLocation: true };
    }
    return null;
  }

  private calculateEstimatedFare(): void {
    const selectedRideType = this.getSelectedRideType();
    if (selectedRideType && this.rideForm.get('pickupLocation')?.value && this.rideForm.get('destination')?.value) {
      const mockDistance = Math.random() * 20 + 2;
      const mockDuration = Math.random() * 30 + 10;
      
      this.estimatedFare = selectedRideType.baseFare + (mockDistance * selectedRideType.perKmRate * selectedRideType.multiplier);
      
      this.routeInfo = {
        distance: `${mockDistance.toFixed(1)} km`,
        duration: `${mockDuration.toFixed(0)} min`,
        via: 'Via Main Roads',
        polyline: ''
      };
    } else {
      this.routeInfo = null;
    }
  }

  private createRideAndFindDrivers(): void {
    if (!this.rideForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    const formData = this.rideForm.value;

    setTimeout(() => {
      try {
        const ride = {
          id: Date.now(),
          rideType: formData.rideType,
          pickupLocation: formData.pickupLocation,
          destination: formData.destination,
          passengers: formData.passengers,
          paymentMethod: formData.paymentMethod,
          estimatedFare: this.estimatedFare,
          currency: this.currencyCode,
          pickupCoordinates: this.pickupCoordinates,
          destinationCoordinates: this.destinationCoordinates,
          routeInfo: this.routeInfo
        };

        this.dialog.closeAll();
        
        import('../find-driver/find-driver.component').then(({ FindDriverComponent }) => {
          this.dialog.open(FindDriverComponent, {
            width: '650px',
            maxWidth: '95vw',
            data: ride,
            disableClose: true,
            panelClass: 'custom-dialog-container'
          });
        }).catch(err => {
          console.error('Failed to load FindDriverComponent:', err);
          this.showErrorMessage('Failed to open driver selection. Please try again.');
        });

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        console.error('🚨 Ride creation failed:', err);
        this.showErrorMessage('Booking failed. Please check your connection and try again.');
      }
    }, 1000);
  }

  findDriver(): void {
    if (!this.rideForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    const pickup = this.rideForm.get('pickupLocation')?.value?.toLowerCase().trim();
    const destination = this.rideForm.get('destination')?.value?.toLowerCase().trim();
    
    if (pickup === destination) {
      this.showErrorMessage('Pickup and destination cannot be the same location.');
      return;
    }

    this.createRideAndFindDrivers();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.rideForm.controls).forEach(key => {
      const control = this.rideForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  hasError(fieldName: string): boolean {
    const field = this.rideForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.rideForm.get(fieldName);
    const fieldLabel = this.getFieldLabel(fieldName);
    
    if (field?.errors?.['required']) {
      return `${fieldLabel} is required`;
    }
    if (field?.errors?.['minlength']) {
      return `${fieldLabel} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    if (field?.errors?.['min']) {
      return `${fieldLabel} must be at least ${field.errors['min'].min}`;
    }
    if (field?.errors?.['max']) {
      return `${fieldLabel} cannot exceed ${field.errors['max'].max}`;
    }
    if (field?.errors?.['sameLocation']) {
      return 'Pickup and destination cannot be the same';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'pickupLocation': 'Pickup location',
      'destination': 'Destination',
      'rideType': 'Ride type',
      'passengers': 'Number of passengers',
      'fare': 'Fare amount',
      'paymentMethod': 'Payment method'
    };
    return labels[fieldName] || fieldName;
  }

  private showErrorMessage(message: string): void {
    alert(message);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  getSelectedRideType(): RideType | undefined {
    return this.rideTypes.find(type => type.value === this.rideForm.get('rideType')?.value);
  }

  isFormReady(): boolean {
    return this.rideForm.valid && this.estimatedFare > 0 && !this.isLoading;
  }

  getButtonText(): string {
    if (this.isLoading) {
      return 'Searching...';
    }
    if (!this.rideForm.valid) {
      return 'Complete Form';
    }
    return 'Find Driver';
  }

  onEnterPressed(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.isFormReady()) {
      this.findDriver();
    }
  }

  // Location picker methods - simplified since using app-navigation
  openLocationPicker(inputType: 'pickup' | 'destination'): void {
    this.activeLocationInput = inputType;
    this.showLocationPicker = true;
    this.pickerMarkerPosition = null;
    console.log('Opening location picker for:', inputType);
    // The app-navigation component will handle the map display
  }

  closeLocationPicker(): void {
    this.showLocationPicker = false;
    this.activeLocationInput = null;
    this.pickerMarkerPosition = null;
  }

  confirmLocationPicker(): void {
    if (this.pickerMarkerPosition && this.activeLocationInput) {
      const address = this.pickerMarkerPosition.address || `${this.pickerMarkerPosition.lat}, ${this.pickerMarkerPosition.lng}`;
      
      if (this.activeLocationInput === 'pickup') {
        this.rideForm.get('pickupLocation')?.setValue(address);
        this.pickupCoordinates = this.pickerMarkerPosition;
      } else {
        this.rideForm.get('destination')?.setValue(address);
        this.destinationCoordinates = this.pickerMarkerPosition;
      }
      
      this.closeLocationPicker();
      this.calculateEstimatedFare();
    }
  }

  // Ride type selection
  selectRideType(value: string): void {
    this.rideForm.get('rideType')?.setValue(value);
    this.calculateEstimatedFare();
  }

  // Map methods
  toggleMapView(): void {
    this.showMapView = !this.showMapView;
    if (this.showMapView && !this.mapInitialized) {
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }
  }

  private initializeMap(): void {
    if (typeof google === 'undefined' || !this.mapContainer) {
      console.log('Google Maps not available or container not found');
      return;
    }

    try {
      const mapElement = this.mapContainer.nativeElement;
      
      // Default center (Kigali, Rwanda)
      const center = { lat: -1.9441, lng: 30.0619 };
      
      this.map = new google.maps.Map(mapElement, {
        zoom: 13,
        center: center,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: false,
        zoomControl: true
      });
      
      this.mapInitialized = true;
      console.log('Map initialized successfully');
      
      // Add click listener for location selection
      this.map.addListener('click', (event: any) => {
        if (event.latLng && this.mapMode) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          
          // Create marker
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: this.map,
            title: `${this.mapMode} location`
          });
          
          // Update coordinates based on mode
          if (this.mapMode === 'pickup') {
            this.pickupCoordinates = { lat, lng };
            this.rideForm.get('pickupLocation')?.setValue(`Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          } else if (this.mapMode === 'destination') {
            this.destinationCoordinates = { lat, lng };
            this.rideForm.get('destination')?.setValue(`Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
          }
          
          this.calculateEstimatedFare();
        }
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  setMapMode(mode: 'pickup' | 'destination'): void {
    this.mapMode = mode;
  }

  // Location input methods
  onLocationInputFocus(type: 'pickup' | 'destination'): void {
    this.activeLocationInput = type;
    this.locationSuggestions = [];
  }

  onLocationInputChange(type: 'pickup' | 'destination', event: any): void {
    const query = event.target.value;
    if (query.length > 2) {
      this.locationSuggestions = [
        { name: 'City Center', address: 'Downtown, Kigali, Rwanda' },
        { name: 'Airport', address: 'Kigali International Airport, Bugesera' },
        { name: 'University', address: 'University of Rwanda, Kigali' }
      ].filter(suggestion => 
        suggestion.name.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.address.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.locationSuggestions = [];
    }
  }

  selectLocationSuggestion(suggestion: any): void {
    if (this.activeLocationInput === 'pickup') {
      this.rideForm.get('pickupLocation')?.setValue(suggestion.address);
    } else if (this.activeLocationInput === 'destination') {
      this.rideForm.get('destination')?.setValue(suggestion.address);
    }
    this.locationSuggestions = [];
    this.calculateEstimatedFare();
  }

  setCurrentLocation(type: 'pickup' | 'destination'): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          const address = `Current Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`;
          
          if (type === 'pickup') {
            this.rideForm.get('pickupLocation')?.setValue(address);
            this.pickupCoordinates = coords;
          }
          
          this.calculateEstimatedFare();
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  swapLocations(): void {
    const pickup = this.rideForm.get('pickupLocation')?.value;
    const destination = this.rideForm.get('destination')?.value;
    
    this.rideForm.get('pickupLocation')?.setValue(destination);
    this.rideForm.get('destination')?.setValue(pickup);
    
    const tempCoords = this.pickupCoordinates;
    this.pickupCoordinates = this.destinationCoordinates;
    this.destinationCoordinates = tempCoords;
    
    this.calculateEstimatedFare();
  }

  changePassengers(delta: number): void {
    const current = this.rideForm.get('passengers')?.value || 1;
    const newValue = Math.max(1, Math.min(6, current + delta));
    this.rideForm.get('passengers')?.setValue(newValue);
    this.calculateEstimatedFare();
  }

  onPaymentSuccess(event: any): void {
    console.log('Payment successful:', event);
  }

  onPaymentFail(event: any): void {
    console.log('Payment failed:', event);
  }

  // Navigation component integration
  onAddressDetected(address: string): void {
    console.log('Address detected from navigation:', address);
    this.selectedLocationFromNav = address;
  }

  confirmLocationFromNav(): void {
    if (this.selectedLocationFromNav && this.activeLocationInput) {
      if (this.activeLocationInput === 'pickup') {
        this.rideForm.get('pickupLocation')?.setValue(this.selectedLocationFromNav);
      } else {
        this.rideForm.get('destination')?.setValue(this.selectedLocationFromNav);
      }
      
      this.closeLocationPicker();
      this.calculateEstimatedFare();
    }
  }
}
