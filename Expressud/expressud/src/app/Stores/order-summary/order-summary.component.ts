import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent {
  @Input() cart: any[] = [];
  @Input() totalAmount: number = 0;

}
