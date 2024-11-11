import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopformComponent } from '../popform/popform.component';


@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {

  constructor(private dialRef:MatDialog){}

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%'; // Adjust the width as needed
    dialogConfig.height = '100%'; // Adjust the height as needed
    this.dialRef.open(PopformComponent, dialogConfig);
  }

  isContentVisible: boolean = false;

  toggleContent(): void {
    this.isContentVisible = !this.isContentVisible;
  }
 
}

