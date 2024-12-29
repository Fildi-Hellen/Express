import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/Services/order.service';

@Component({
  selector: 'app-tracking-status',
  templateUrl: './tracking-status.component.html',
  styleUrl: './tracking-status.component.css'
})
export class TrackingStatusComponent implements OnInit{

  trackingId: string = '';
    order: any = null;
    errorMessage: string = '';
  
    constructor(private orderService: OrderService) {}
  
    ngOnInit(): void {
      // Initialize if needed
    }
  
    trackOrder(): void {
      if (!this.trackingId) {
        this.errorMessage = 'Please enter a valid tracking ID.';
        return;
      }
  
      this.orderService.trackOrder(this.trackingId).subscribe({
        next: (response) => {
          this.order = response;
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error tracking order:', error);
          this.order = null;
          this.errorMessage = 'Order not found. Please check the tracking ID and try again.';
        }
      });
    }

}
