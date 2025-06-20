import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../Services/order.service';

@Component({
  selector: 'app-order-managements',
  templateUrl: './order-managements.component.html',
  styleUrls:[ './order-managements.component.css']
})
export class OrderManagementsComponent implements OnInit {

  orders: any[] = [];
  drivers: any[] = [];
  errorMessage: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.fetchAvailableDrivers();
  }

  fetchOrders(): void {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No token found. Cannot fetch secured vendor orders.');
      // Optional: Provide fallback behavior (e.g., fetch public orders or show a message)
      this.orders = [];
      alert('Please log in to view your vendor orders.');
      return;
    }
  
    // Fetch vendor orders with authentication
    this.orderService.getVendorOrders().subscribe({
      next: (orders: any[]) => {
        this.orders = orders;
        console.log('Vendor orders fetched successfully:', orders);
      },
      error: (error) => {
        console.error('Error fetching vendor orders:', error);
        alert('Failed to fetch vendor orders. Please try again.');
      },
    });
  }
  
  

  fetchAvailableDrivers(): void {
    this.orderService.getAvailableDrivers().subscribe(
      (data: any[]) => (this.drivers = data),
      (error: any) => console.error('Error fetching drivers:', error)
    );
  }
  
  

  updateOrderStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe(
      () => {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = status;
        }
        alert(`Order status updated to ${status}`);
      },
      (error: any) => console.error('Error updating order status:', error)
    );
  }

  onDriverChange(event: Event, orderId: number): void {
    const target = event.target as HTMLSelectElement;
    const driverId = parseInt(target.value, 10);
    if (driverId) {
      this.assignDriver(orderId, driverId);
    }
  }

  assignDriver(orderId: number, driverId: number): void {
    this.orderService.assignDriver(orderId, driverId).subscribe({
      next: () => {
        alert('Driver assigned successfully!');
        this.fetchOrders(); // Update orders
      },
      error: (error) => console.error('Error assigning driver:', error),
    });
  }
  
}
