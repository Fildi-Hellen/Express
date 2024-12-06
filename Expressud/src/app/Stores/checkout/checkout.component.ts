import { Component,  OnInit } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';
import { OrderService } from 'src/app/Services/order.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartItems: any[] = [];
  totalPrice: number = 0;
  address: { fullName: string; locationAddress: string; contact: string } | null = null;
  selectedPaymentMethod: string | null = null;
  recipient: { name: string; phone: string } | null = null; // Recipient data

  constructor(private cartService: CartService, private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
    this.calculateTotalPrice();
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }
  setRecipient(recipient: { name: string; phone: string }): void {
    this.recipient = recipient;
    console.log('Recipient data updated:', recipient);
  }

  setAddress(address: { fullName: string; locationAddress: string; contact: string }): void {
    this.address = address;
    console.log('Address updated:', this.address);
  }

  updatePaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    console.log('Payment Method updated:', method);
  }

  
  isOrderValid(): boolean {
    return !!this.address && !!this.selectedPaymentMethod && this.cartItems.length > 0;
  }

  confirmOrder(): void {
    if (!this.isOrderValid()) {
      alert('Please provide all required details.');
      return;
    }

    const orderData = {
      address: this.address,
      paymentMethod: this.selectedPaymentMethod,
      recipient: this.recipient,
      cartItems: this.cartItems,
      total: this.totalPrice
    };

    this.orderService.confirmOrder(orderData).subscribe(
      (response) => {
        console.log('Order confirmed successfully:', response);
        alert('Order confirmed successfully!');
        this.cartService.clearCart();
        this.resetCheckout();
      },
      (error) => {
        console.error('Error confirming order:', error);
        alert('Failed to confirm order. Please try again.');
      }
    );
  }

  resetCheckout(): void {
    this.cartItems = [];
    this.totalPrice = 0;
    this.address = null;
    this.selectedPaymentMethod = null;
    this.recipient = null;
  }

  // Increase item quantity
  increaseQuantity(item: any): void {
    item.quantity++;
    this.updateCart();
  }

  // Decrease item quantity
  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    } else {
      this.removeFromCart(item);
    }
  }
  // Remove item from cart
  removeFromCart(item: any): void {
    this.cartItems = this.cartItems.filter((cartItem) => cartItem !== item);
    this.updateCart();
  }

  // Update cart and recalculate total
  updateCart(): void {
    this.cartService.updateCart(this.cartItems); // Assume CartService has this method
    this.calculateTotalPrice();
  }

}
