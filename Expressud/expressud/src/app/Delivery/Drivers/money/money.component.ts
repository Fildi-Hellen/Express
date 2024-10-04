import { Component } from '@angular/core';

@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrl: './money.component.css'
})
export class MoneyComponent {
  balance: number = 1000; // Initial balance
  withdrawAmount: number | null = null;
  transactions: { date: Date, amount: number }[] = [];

  withdraw() {
    if (this.withdrawAmount !== null && this.withdrawAmount > 0 && this.withdrawAmount <= this.balance) {
      this.balance -= this.withdrawAmount;
      this.transactions.push({ date: new Date(), amount: -this.withdrawAmount });
      this.withdrawAmount = null; // Clear the input field
    }
  }

  // Method to get absolute value of a number
  getAbsoluteValue(number: number): number {
    return Math.abs(number);
  }

}
