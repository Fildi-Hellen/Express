import { Component } from '@angular/core';
import { DriverService } from '../../Services/driver.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    standalone: false
})
export class OrderComponent {
  
  assignedOrders: any[] = [];
  driverId: number = 1; // This should be dynamically set based on logged-in driver

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.fetchAssignedOrders();
  }

  fetchAssignedOrders(): void {
    this.driverService.getDriverOrders(this.driverId).subscribe(
      (data: any[]) => (this.assignedOrders = data),
      (error: any) => console.error('Error fetching assigned orders:', error)
    );
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.driverService.updateOrderStatus(orderId, status).subscribe(
      () => {
        const order = this.assignedOrders.find(o => o.id === orderId);
        if (order) {
          order.status = status;
        }
        alert(`Order status updated to ${status}`);
      },
      (error: any) => console.error('Error updating order status:', error)
    );
  }

}


