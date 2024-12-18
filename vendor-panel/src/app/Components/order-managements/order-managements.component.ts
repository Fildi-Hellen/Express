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
  errorMessage: string = ''; // Declare errorMessage property


  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.fetchAvailableDrivers();
  }

  fetchOrders(): void {
    this.orderService.getVendorOrders().subscribe(
      (data: any[]) => (this.orders = data),
      (error: any) => console.error('Error fetching orders:', error)
    );
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

 // Existing method with a minor addition to handle driver assignment
onDriverChange(event: Event, orderId: number): void {
  const target = event.target as HTMLSelectElement;
  const driverId = parseInt(target.value, 10);
  if (driverId) {
    this.assignDriver(orderId, driverId);
  }
}

// Add method to communicate driver assignment to the backend
assignDriver(orderId: number, driverId: number): void {
  this.orderService.assignDriver(orderId, driverId).subscribe({
    next: () => {
      alert('Driver assigned successfully!');
      this.fetchOrders(); // Refetch orders to update the list showing assignments
    },
    error: (error) => console.error('Error assigning driver:', error),
  });
}

  

  fetchDrivers(): void {
    this.orderService.getAllDrivers().subscribe({
      next: (data) => (this.drivers = data),
      error: (error) => {
        console.error('Error fetching drivers:', error);
        this.errorMessage = 'Could not load drivers. Please try again later.';
      },
    });
  }

  // assignDriver(orderId: number, driverId: number): void {
  //   this.orderService.assignDriver(orderId, driverId).subscribe({
  //     next: () => {
  //       alert('Driver assigned successfully!');
  //       this.fetchOrders(); 
  //     },
  //     error: (error) => console.error('Error assigning driver:', error),
  //   });
  // }
  
}
