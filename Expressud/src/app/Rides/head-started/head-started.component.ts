import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookingsComponent } from '../bookings/bookings.component';

@Component({
  selector: 'app-head-started',
  templateUrl: './head-started.component.html',
  styleUrls: ['./head-started.component.css']
})
export class HeadStartedComponent {
  constructor(public dialog: MatDialog) {}

  openRideDialog(): void {
    this.dialog.open(BookingsComponent, {
      width: '400px',
      height: 'auto'
    });
  }

}
