import {
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;
  @Output() addressDetected = new EventEmitter<string>();

  map!: google.maps.Map;
  geocoder!: google.maps.Geocoder;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  distanceService!: google.maps.DistanceMatrixService;

  deliveryAddress = '';
  origin!: google.maps.LatLngLiteral;
  destination!: google.maps.LatLngLiteral;
  travelDistance = '';
  travelDuration = '';

  options: google.maps.MapOptions = {
    center: { lat: -31, lng: 147 },
    zoom: 4,
  };

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeMap();
    this.initializePlacesAutocomplete();
  }

  initializeMap(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.options);
    this.geocoder = new google.maps.Geocoder();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map });
    this.distanceService = new google.maps.DistanceMatrixService();
    
    // Add click listener for location selection
    this.map.addListener('click', (event: any) => {
      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        this.destination = { lat, lng };
        
        // Clear existing markers and add new one
        this.clearMarkers();
        new google.maps.Marker({
          position: this.destination,
          map: this.map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            strokeWeight: 3,
            strokeColor: '#fff',
            fillColor: '#dc3545',
            fillOpacity: 1
          },
          title: 'Selected Location',
          animation: google.maps.Animation.DROP
        });
        
        // Reverse geocode to get address
        this.fetchAddress(this.destination);
        
        if (this.origin && this.destination) {
          this.drawRoute();
          this.calculateDistance();
        }
      }
    });
  }
  
  private clearMarkers(): void {
    // Note: In a more robust implementation, you'd want to track markers
    // For now, we'll clear by recreating the map if needed
  }

  initializePlacesAutocomplete(): void {
    const autocomplete = new google.maps.places.Autocomplete(this.searchInput.nativeElement);
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        this.destination = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        this.deliveryAddress = place.formatted_address ?? '';
        this.addressDetected.emit(this.deliveryAddress);

        if (this.origin && this.destination) {
          this.drawRoute();
          this.calculateDistance();
        }
      });
    });
  }

  detectLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          this.map.setCenter(this.origin);
          this.map.setZoom(15); // Zoom in closer for better view
          
          new google.maps.Marker({
            position: this.origin,
            map: this.map,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              strokeWeight: 3,
              strokeColor: '#fff',
              fillColor: '#28a745', // Green for current location
              fillOpacity: 1
            },
            title: 'Your Current Location',
          });

          this.fetchAddress(this.origin);
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.addressDetected.emit('');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      this.addressDetected.emit('');
    }
  }

  fetchAddress(latLng: google.maps.LatLngLiteral): void {
    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        this.ngZone.run(() => {
          this.deliveryAddress = results[0].formatted_address;
          this.addressDetected.emit(this.deliveryAddress);
        });
      } else {
        this.addressDetected.emit('');
      }
    });
  }

  drawRoute(): void {
    this.directionsService.route(
      {
        origin: this.origin,
        destination: this.destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          this.directionsRenderer.setDirections(result);
        }
      }
    );
  }

  calculateDistance(): void {
    this.distanceService.getDistanceMatrix(
      {
        origins: [this.origin],
        destinations: [this.destination],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === 'OK' && response) {
          const info = response.rows[0].elements[0];
          this.travelDistance = info.distance.text;
          this.travelDuration = info.duration.text;
        }
      }
    );
  }

  searchLocation(): void {
    const input = this.searchInput.nativeElement.value;
    if (!input) return;
  
    this.geocoder.geocode({ address: input }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
  
        this.destination = {
          lat: location.lat(),
          lng: location.lng()
        };
  
        this.map.setCenter(this.destination);
  
        new google.maps.Marker({
          position: this.destination,
          map: this.map,
          icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
          title: 'Destination'
        });
  
        this.ngZone.run(() => {
          this.deliveryAddress = results[0].formatted_address;
          this.addressDetected.emit(this.deliveryAddress);
          if (this.origin && this.destination) {
            this.drawRoute();
            this.calculateDistance();
          }
        });
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  }
}
