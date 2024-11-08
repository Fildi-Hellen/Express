import { Component, ElementRef, EventEmitter, NgZone, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef;
  @Output() addressDetected = new EventEmitter<string>();

  deliveryAddress: string = '';
  map!: google.maps.Map;
  geocoder!: google.maps.Geocoder;
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: -31, lng: 147 },
    zoom: 4,
  };

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.mapInitializer();
  }

  mapInitializer(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.options);
    this.geocoder = new google.maps.Geocoder();
  }

  detectLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setCenter(pos);
        new google.maps.Marker({
          position: pos,
          map: this.map,
          title: 'Your Location'
        });
        this.getGeocode(pos);
      }, () => {
        this.emitManualAddress();
      });
    } else {
      this.emitManualAddress();
    }
  }

  getGeocode(latLng: google.maps.LatLngLiteral): void {
    this.geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        this.ngZone.run(() => {
          this.deliveryAddress = results[0].formatted_address;
          this.addressDetected.emit(this.deliveryAddress);
        });
      } else {
        this.emitManualAddress();
      }
    });
  }

  emitManualAddress(): void {
    this.addressDetected.emit('');
  }
}
