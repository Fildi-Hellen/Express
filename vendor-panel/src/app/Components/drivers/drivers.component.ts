import { Component } from '@angular/core';
import { OrderService } from '../../Services/order.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.css']
})
export class DriversComponent {

  drivers: any[] = [];
  errorMessage: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers(): void {
    this.orderService.getAllDrivers().subscribe({
      next: (data) => {
        this.drivers = data;
      },
      error: (error) => {
        console.error('Error fetching drivers:', error);
        this.errorMessage = 'Could not load drivers. Please try again later.';
      },
    });
  }

}
