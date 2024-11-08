import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';
import { FoodService } from 'src/app/Services/food.service';

@Component({
  selector: 'app-carts-page',
  templateUrl: './carts-page.component.html',
  styleUrls: ['./carts-page.component.css']
})
export class CartsPageComponent implements OnInit {

  cartItems: any[] = [];
  totalAmount: number = 0;
  currency: string = 'SSP'; // Default currency

  constructor(private cartService: CartService, private foodService: FoodService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItems = cartItems;
      this.calculateTotalAmountAndCurrency();
    });
  }

  calculateTotalAmountAndCurrency(): void {
    this.totalAmount = 0;
    this.currency = this.cartItems.length > 0 ? this.cartItems[0].currency : 'SSP'; // Set currency to the first item's currency

    this.totalAmount = this.cartItems.reduce((total, item) => {
      if (item.currency !== this.currency) {
        this.currency = 'Multiple';
      }
      return total + item.price * item.quantity;
    }, 0);
  }

  removeFromCart(item: any): void {
    this.cartService.removeFromCart(item);
    this.calculateTotalAmountAndCurrency(); // Recalculate after removing an item
  }

  onProceedToCheckout(): void {
    const cartItemsJson = JSON.stringify(this.cartItems);
    this.router.navigate(['/checkout'], { queryParams: { cartItems: cartItemsJson, totalAmount: this.totalAmount, currency: this.currency } });
  }
}
