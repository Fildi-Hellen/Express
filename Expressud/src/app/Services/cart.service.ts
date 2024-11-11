import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartService {

   private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      const cartItems = JSON.parse(cart);
      this.cartItemsSubject.next(cartItems);
      this.cartItemCountSubject.next(this.calculateItemCount(cartItems));
    }
  }

  addToCart(item: any): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex((cartItem: any) => cartItem.id === item.id);
    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += 1;
    } else {
      item.quantity = 1;
      currentItems.push(item);
    }

    this.updateCart(currentItems);
  }

  removeFromCart(item: any): void {
    let currentItems = this.cartItemsSubject.value;
    currentItems = currentItems.filter(cartItem => cartItem.id !== item.id);
    this.updateCart(currentItems);
  }

  getCartItems(): any[] {
    return this.cartItemsSubject.value;
  }

  private updateCart(cartItems: any[]): void {
    this.cartItemsSubject.next(cartItems);
    this.cartItemCountSubject.next(this.calculateItemCount(cartItems));
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  private calculateItemCount(cartItems: any[]): number {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}

