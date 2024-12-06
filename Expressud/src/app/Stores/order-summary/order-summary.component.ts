import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';
import { FeedbackComponent } from 'src/app/Page/feedback/feedback.component';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
})
export class OrderSummaryComponent implements OnInit {
  @Input() cartItems: any[] = [];
  @Input() totalPrice: number = 0;
  @Input() isOrderValid: boolean = false;

  @Output() confirmOrderEvent = new EventEmitter<void>();

  constructor(private cartService: CartService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  confirmOrder(): void {
    console.log('Confirm Order button clicked');
    if (!this.isOrderValid) {
      alert('Please provide all required details.');
      return;
    }

    // Emit order confirmation event
    this.confirmOrderEvent.emit();

    // Simulate order success and open feedback dialog
    setTimeout(() => {
      this.openFeedbackDialog();
    }, 500);
  }

  openFeedbackDialog(): void {
    const dialogRef = this.dialog.open(FeedbackComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Feedback dialog closed', result);
    });
  }
}
