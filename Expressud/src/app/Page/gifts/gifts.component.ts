import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RecipientComponent } from '../recipient/recipient.component';

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.css']
})
export class GiftsComponent {

   @Output() recipientData = new EventEmitter<{ name: string; phone: string }>();

  constructor(public dialogRef: MatDialog) {}

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40%'; // Adjust width as needed
    dialogConfig.height = '90%'; // Adjust height as needed
    const dialogRef = this.dialogRef.open(RecipientComponent, dialogConfig);

    // Subscribe to the dialog close event and emit recipient data
    dialogRef.afterClosed().subscribe((data: { name: string; phone: string }) => {
      if (data) {
        this.recipientData.emit(data); // Emit data to parent
      }
    });
  }


}
