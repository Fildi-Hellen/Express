import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EchoService } from '../../Services/echo.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent implements OnInit{
  incomingRide: any = null;
  driverId = 123; // Replace with actual driver ID
  cancellationReason: string = '';

  constructor(
    private echoService: EchoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.echoService.echo.channel('drivers')
      .listen('.new-ride-request', (data: any) => {
        console.log('📡 New ride request:', data);
        this.incomingRide = { ...data.ride, status: 'pending' };
      });

    this.echoService.listenToDriverCancellation(this.driverId, (cancelData) => {
      alert(`❌ Ride #${cancelData.ride_id} was cancelled. Reason: ${cancelData.reason}`);
      this.incomingRide = null;
    });
  }

  acceptRide(): void {
    this.http.post('/api/driver/accept-ride', {
      ride_id: this.incomingRide.id,
      driver_id: this.driverId
    }).subscribe(() => {
      alert('✅ Ride accepted. User notified!');
      this.incomingRide.status = 'confirmed';
    });
  }

  declineRide(): void {
    this.incomingRide = null;
  }

  cancelBookedRide(): void {
    if (!this.cancellationReason.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    this.http.post(`/api/driver/cancel-ride/${this.incomingRide.id}`, {
      reason: this.cancellationReason
    }).subscribe({
      next: (response: any) => {
        alert(response.message);
        this.incomingRide = null;
        this.cancellationReason = '';
      },
      error: (err) => {
        alert(err.error.message || 'Error cancelling ride.');
      }
    });
  }


}
