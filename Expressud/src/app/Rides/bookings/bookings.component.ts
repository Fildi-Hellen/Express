import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { FindDriverComponent } from '../find-driver/find-driver.component';
import { DriverService } from 'src/app/Services/driver.service';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  rideForm: FormGroup;
  userLocation: { lat: number; lng: number } | null = null;
  mapZoom = 14;
  rideTypes = ['Economy', 'Luxury', 'Taxi', 'Motorbike'];
  paymentMethods: string[] = [];
  currencyCode = 'USD';

  constructor(private fb: FormBuilder,  private router: Router, private dialog: MatDialog,private driverService:DriverService) {
     this.rideForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      destination:     ['', Validators.required],
      rideType:        ['', Validators.required],
      fare:            [0, [Validators.required, Validators.min(1)]],
      paymentMethod:   ['Cash', Validators.required],
      passengers:      [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    this.detectLocationAndSetCurrency();
  }

  detectLocationAndSetCurrency(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const { lat, lng } = this.userLocation;
          if (lat >= 3 && lat <= 5 && lng >= 29 && lng <= 31) {
            // Rwanda region
            this.currencyCode = 'RWF';
            this.paymentMethods = ['Cash', 'MTN Rwanda', 'Airtel Pay', 'Flutterwave'];
          } else if (lat >= 3 && lat <= 7 && lng >= 24 && lng <= 32) {
            // South Sudan region
            this.currencyCode = 'SSP';
            this.paymentMethods = ['Cash', 'MoMo (South Sudan)', 'Flutterwave'];
          } else {
            // Fallback/default
            this.currencyCode = 'USD';
            this.paymentMethods = ['Cash', 'Flutterwave'];
          }

          this.rideForm.patchValue({ paymentMethod: 'Cash' });
        },
        () => {
          this.paymentMethods = ['Cash', 'Stripe'];
        }
      );
    }
  }
onPaymentSuccess(event: any): void {
  const rideData = this.rideForm.value;
  this.driverService.createRideAndFetchDrivers({
     pickup_location: rideData.pickupLocation,
      destination:    rideData.destination,
      ride_type:       rideData.rideType,
      fare:           rideData.fare,
      currency:        this.currencyCode,
      passengers:      rideData.passengers
  }).subscribe({
    next: (response) => {
      console.log('🚗 Booking response:', response);

      const ride = response.ride;
      if (!ride?.id) {
        console.error('❌ Backend did not return ride ID', response);
        return;
      }

      this.dialog.open(FindDriverComponent, {
        width: '400px',
        data: {
          id: ride.id,
          ...ride,
          rideType: rideData.rideType,
           pickup_location: rideData.pickupLocation,
          destination:    rideData.destination,
          paymentMethod: rideData.paymentMethod
        }
      });
    },
    error: (err) => {
      console.error('🚨 Ride creation failed:', err);
      alert(err.error.message || 'Booking failed.');
    }
  });
}




  onPaymentFail(event: any): void {
    console.error('⚠️ Payment failed', event);
  }
   
  

  findDriver(): void {
    // Fallback if someone clicks “Find Driver” without paying
    const rd = this.rideForm.value;
     const dialogRef =this.dialog.open(FindDriverComponent, {
      width: '400px',
      data: {
        pickup_location: rd.pickupLocation,
        destination:     rd.destination,
        ride_type:       rd.rideType,
        fare:            rd.fare,
        currency:        this.currencyCode,
        passengers:      rd.passengers
      }
    });
  
  
   dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('User selected driver:', result);
        // Optionally confirm booking here, e.g.
        // this.driverService.confirmRide({ ride_id: ..., driver_id: result.id }).subscribe(...)
      }
    });
  }
}