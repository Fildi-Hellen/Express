import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'src/app/Services/food.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  @Input() totalAmount: number = 0;
  @Input() cartItems: any[] = [];
  deliveryAddress: string = '';
  phoneNumber: string = '';
  selectedPaymentMethod: string = '';
  currency: string = 'SSP'; // Default currency

  constructor(private foodService: FoodService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cartItems = JSON.parse(params['cartItems']);
      this.totalAmount = params['totalAmount'];
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

  updateAddress(address: string): void {
    this.deliveryAddress = address;
  }

  updatePaymentMethod(event: any): void {
    this.selectedPaymentMethod = event;
  }

  onOrder(): void {
    if (!this.cartItems.length) {
      alert('Your cart is empty');
      return;
    }

    if (!this.deliveryAddress) {
      alert('Please enter your delivery address');
      return;
    }

    if (!this.phoneNumber) {
      alert('Please enter your phone number');
      return;
    }

    if (!this.selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    const orderData = {
      totalAmount: this.totalAmount,
      deliveryAddress: this.deliveryAddress,
      phoneNumber: this.phoneNumber,
      cartItems: this.cartItems,
      paymentMethod: this.selectedPaymentMethod,
      currency: this.currency
    };

    this.foodService.placeOrder(orderData).subscribe(
      (res: any) => {
        if (res.result) {
          alert('Order Placed Successfully');
          localStorage.removeItem('cart');
          this.cartItems = [];
          this.totalAmount = 0;
          this.router.navigate(['/thank-you']);
        } else {
          alert(res.message);
        }
      },
      (err: any) => {
        console.error('Error placing order:', err);
      }
    );
  }
}
