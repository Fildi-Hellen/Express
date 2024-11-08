import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MoneyComponent } from '../money/money.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent {

  constructor(private dialogRef:MatDialog){}

  openDialog(){
    this.dialogRef.open(MoneyComponent);
  }

}
