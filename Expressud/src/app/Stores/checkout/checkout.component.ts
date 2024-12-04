import { Component,  OnInit } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Load cart items
  loadCart(): void {
    this.cartItems = this.cartService.getCart();
    this.calculateTotalPrice();
  }

  // Calculate total price
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  // Mock place order
  placeOrder(): void {
    alert('Order placed successfully!');
    this.cartService.clearCart();
  }
// Increase item quantity
increaseQuantity(item: any): void {
  this.cartService.updateQuantity(item, item.quantity + 1);
  this.loadCart();
}

// Decrease item quantity
decreaseQuantity(item: any): void {
  if (item.quantity > 1) {
    this.cartService.updateQuantity(item, item.quantity - 1);
    this.loadCart();
  } else {
    this.removeFromCart(item);
  }
}
removeFromCart(item: any): void {
  this.cartService.removeFromCart(item);
  this.loadCart();
}



  
}
