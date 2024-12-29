import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../Services/driver.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone: false
})
export class OrderComponent implements OnInit {

  assignedOrders: any[] = [];
  driverId: number | null = null;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDriverId();
    this.fetchAssignedOrders();
  }

  loadDriverId(): void {
    const storedDriverId = localStorage.getItem('driverId');
    if (storedDriverId) {
      this.driverId = +storedDriverId; // Convert to number
      console.log(`Driver ID loaded: ${this.driverId}`);
    } else {
      console.warn('Driver ID not found in localStorage. Using default driver ID.');
      this.driverId = 7; // Example default ID
    }
  }
  

  fetchAssignedOrders(): void {
  if (!this.driverId) {
    console.warn('Fetching orders without a driver ID.');
    // Optional: Call a fallback API to fetch unassigned orders or show a message.
    this.assignedOrders = []; // Or implement fallback logic here
    return;
  }

  this.driverService.getDriverOrders(this.driverId).subscribe({
    next: (data: any[]) => {
      this.assignedOrders = data;
      console.log('Assigned orders fetched:', data);
    },
    error: (error: any) => {
      console.error('Error fetching assigned orders:', error);
      if (error.status === 404) {
        alert('No orders found for this driver.');
      } else {
        alert('An unexpected error occurred while fetching orders.');
      }
    },
  });
}

  updateOrderStatus(orderId: number, status: string): void {
    if (!this.driverId) {
      console.error('Driver ID is missing. Cannot update order status.');
      return;
    }

    this.driverService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        const order = this.assignedOrders.find(o => o.id === orderId);
        if (order) {
          order.status = status;
        }
        alert(`Order status updated to ${status}`);
      },
      error: (error: any) => {
        console.error('Error updating order status:', error);
        alert('An unexpected error occurred while updating order status.');
      },
    });
  }
}
