import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-recipient',
  templateUrl: './recipient.component.html',
  styleUrls:[ './recipient.component.css']
})
export class RecipientComponent {
  recipient = { name: '', phone: '' };

  constructor(public dialogRef: MatDialogRef<RecipientComponent>) {}

  saveRecipient(): void {
    if (this.recipient.name && this.recipient.phone) {
      this.dialogRef.close(this.recipient); // Pass recipient data to GiftsComponent
    } else {
      alert('Please fill in all fields.');
    }
  }
}
