import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DriverService } from 'src/app/Services/driver.service';
import { EchoService } from 'src/app/Services/echo.service'; // Make sure this service is set up

@Component({
  selector: 'app-find-driver',
  templateUrl: './find-driver.component.html',
  styleUrls: ['./find-driver.component.css']
})
export class FindDriverComponent implements OnInit {
  drivers: any[] = [];
  booking: any;
  isLoading = true;
  confirmationMessage = '';
  cancellationReason = '';
  showCancelForm = false;

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

    // Listen for real-time assignment events
    this.echoService
      .listen(`users.${this.booking.user_id}`, '.ride-assigned', (evt: any) => {
        this.confirmationMessage = `Driver confirmed: ${evt.driver.name}`;
        this.drivers = [evt.driver];
        this.isLoading = false;
        setTimeout(() => this.dialogRef.close(evt.driver), 3000);
      });
  }

  private loadDrivers(): void {
    this.driverService
      .createRideAndFetchDrivers({
        ride_type:       this.booking.ride_type,
        pickup_location: this.booking.pickup_location,
        destination:     this.booking.destination,
        fare:            this.booking.fare,
        currency:        this.booking.currency,
        passengers:      this.booking.passengers
      })
      .subscribe({
        next: resp => {
          this.booking = resp.ride;
          this.drivers = resp.drivers.sort((a:any, b:any) => a.distance - b.distance);
          this.isLoading = false;
        },
        error: err => {
          console.error('Error fetching drivers', err);
          this.isLoading = false;
        }
      });
  }

  orderRide(driver: any): void {
    this.driverService
      .confirmRide({
        ride_id:   this.booking.id,
        driver_id: driver.id
      })
      .subscribe({
        next: () => {
          this.confirmationMessage = '✅ Ride confirmed!';
        },
        error: err => {
          console.error('Error confirming ride', err);
        }
      });
  }

  toggleCancel(): void {
    this.showCancelForm = !this.showCancelForm;
  }

  cancelRide(): void {
    if (!this.cancellationReason.trim()) {
      alert('Please enter a cancellation reason.');
      return;
    }

    this.driverService
      .cancelRide(this.booking.id, this.cancellationReason)
      .subscribe({
        next: resp => {
          alert(resp.message);
          this.dialogRef.close();
        },
        error: err => {
          console.error('Cancel failed', err);
          alert(err.error?.message || 'Cancel failed');
        }
      });
  }

}
