import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-message',
  templateUrl: './confirm-message.component.html',
  styleUrl: './confirm-message.component.css'
})
export class ConfirmMessageComponent {


  constructor(
    public dialogRef: MatDialogRef<ConfirmMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  message: string = "You have successfully placed your order.";

  viewReceipt(): void {
    // Implement view receipt logic
    this.dialogRef.close({ action: 'viewReceipt' });
  }

  trackOrder(): void {
    // Implement track order logic
    this.dialogRef.close({ action: 'trackOrder' });
  }

}
