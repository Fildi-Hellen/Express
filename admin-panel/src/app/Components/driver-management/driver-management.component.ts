import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../Services/driver.service';

@Component({
  selector: 'app-driver-management',
  templateUrl: './driver-management.component.html',
  styleUrl: './driver-management.component.css'
})
export class DriverManagementComponent implements OnInit {
  drivers: any[] = [];
  errorMessage: string = '';

  constructor(private driverService: DriverService) {}
  

  ngOnInit(): void {
    this.fetchDrivers();
  }

  fetchDrivers(): void {
    this.driverService.getAllDrivers().subscribe({
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
