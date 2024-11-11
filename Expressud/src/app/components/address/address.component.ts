import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent  {
  userAddress!: string;

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.successCallback.bind(this),
        this.errorCallback.bind(this)
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  
  successCallback(position: GeolocationPosition): void {
    const latitude: number = position.coords.latitude;
    const longitude: number = position.coords.longitude;

    // Perform reverse geocoding
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBWp5W006BrypJCT8hWRsQkwv3QLVIf5ME`)
      .then(response => response.json())
      .then((data: any) => {
        // Extract address components from the response
        const addressComponents = data.results[0].address_components;

        // Construct the address string
        let address: string = "";
        for (let i = 0; i < addressComponents.length; i++) {
          address += addressComponents[i].long_name + ", ";
        }
        address = address.slice(0, -2); // Remove the trailing comma and space

        // Update userAddress with the obtained address
        this.userAddress = address;
      })
      .catch(error => console.error("Error fetching address: ", error));
  }

  errorCallback(error: GeolocationPositionError): void {
    console.error("Error getting user's location: ", error.message);
  }
}