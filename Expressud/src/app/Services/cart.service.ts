import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: any[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);

  cartItemCount$ = this.cartItemCount.asObservable();

  constructor() {}

  // Add item to the cart
  addToCart(item: any): void {
    const existingItem = this.cart.find((cartItem) => cartItem.name === item.name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
    this.updateCartItemCount();
  }

  // Remove item from the cart
  removeFromCart(item: any): void {
    this.cart = this.cart.filter((cartItem) => cartItem.name !== item.name);
    this.updateCartItemCount();
  }

  // Update item quantity
  updateQuantity(item: any, quantity: number): void {
    const cartItem = this.cart.find((cartItem) => cartItem.name === item.name);
    if (cartItem) {
      cartItem.quantity = quantity;
    }
    this.updateCartItemCount();
  }

  // Get all items in the cart
  getCart(): any[] {
    return this.cart;
  }

  // Clear the cart
  clearCart(): void {
    this.cart = [];
    this.updateCartItemCount();
  }

  // Update the cart item count
  private updateCartItemCount(): void {
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartItemCount.next(totalCount);
  }
  
}

