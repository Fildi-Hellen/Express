import { Component, OnInit } from '@angular/core';
import { MapService } from '../../Services/map.service';
import L from 'leaflet';

@Component({
    selector: 'app-navigations',
    templateUrl: './navigations.component.html',
    styleUrl: './navigations.component.css',
    standalone: false
})
export class NavigationsComponent implements OnInit {

    map!: L.Map;
    currentPosition: [number, number] = [40.7128, -74.0060]; // Example: New York City
    destination: [number, number] = [40.730610, -73.935242]; // Example destination
    routeDetails: any = {};
    shareLink: string = '';
  
    constructor(private mapService: MapService) {}
  
    ngOnInit(): void {
        
      this.initMap();
      this.loadRouteDetails();

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'assets/images/marker.png',
        iconUrl: 'assets/images/pin-icon.png',
        shadowUrl: 'assets/images/location-pin.png'
      });

    }
  
    initMap(): void {
      this.map = L.map('map', {
        center: this.currentPosition,
        zoom: 13
      });
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
  
      // Add markers for current position and destination
      L.marker(this.currentPosition).addTo(this.map).bindPopup('You are here');
      L.marker(this.destination).addTo(this.map).bindPopup('Destination');
  
      // In a real scenario, draw a route line between these points using a routing API.
    }
  
    loadRouteDetails(): void {
      this.mapService.getRouteDetails(this.currentPosition, this.destination).subscribe(data => {
        this.routeDetails = data;
      });
    }
  
    shareCurrentLocation(): void {
      this.mapService.shareLocation().subscribe(response => {
        if (response.success) {
          this.shareLink = response.link;
          alert('Location share link copied!');
        }
      });
    }

    

}
