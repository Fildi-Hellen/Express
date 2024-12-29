import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-carts-page',
  templateUrl: './carts-page.component.html',
  styleUrls: ['./carts-page.component.css']
})
export class CartsPageComponent implements OnInit {
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

  // Remove item from cart
  removeFromCart(item: any): void {
    this.cartService.removeFromCart(item);
    this.loadCart();
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

  // Calculate total price
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

}
