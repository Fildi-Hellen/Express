import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RecipientComponent } from '../recipient/recipient.component';

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrl: './gifts.component.css'
})
export class GiftsComponent {
  constructor(public dialRef: MatDialog) {}

  
openDialog(): void {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '40%'; // Adjust the width as needed
  dialogConfig.height = '90%'; // Adjust the height as needed
  this.dialRef.open(RecipientComponent, dialogConfig);
}

}
