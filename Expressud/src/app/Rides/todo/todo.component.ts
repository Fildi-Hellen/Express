import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookingsComponent } from '../bookings/bookings.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {
  constructor(public dialog: MatDialog) {}
  
    openRideDialog(): void {
      this.dialog.open(BookingsComponent, {
        width: '400px',
        height: 'auto'
      });
    }
  steps = [
    { number: 1, title: 'Download E-rides', description: 'Enter your phone number and confirm it with the code(COMING SOON)' },
    { number: 2, title: 'City', description: 'In the side menu, select City. Enter addresses in the From and To fields' },
    { number: 3, title: 'Set your price', description: 'Drivers can accept or make a counter-offer' },
    { number: 4, title: 'Driver selection', description: 'View arrival times and current locations' }
  ];
  

}
