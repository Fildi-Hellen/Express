import { Component } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { ConfirmMessageComponent } from '../confirm-message/confirm-message.component';


@Component({
  selector: 'app-confirm-btn',
  templateUrl: './confirm-btn.component.html',
  styleUrl: './confirm-btn.component.css'
})
export class ConfirmBtnComponent {

  // Inside your component or service class
constructor(public dialRef: MatDialog) {}

openConfirmMessage(): void {
  const dialRef = this.dialRef.open(ConfirmMessageComponent, {
    width: '250px',
  });

  dialRef.afterClosed().subscribe(result => {
    if (result && result.action === 'viewReceipt') {
      // Handle view receipt action
    } else if (result && result.action === 'trackOrder') {
      // Handle track order action
    }
  });
}

  
}

