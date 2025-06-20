import { Component, EventEmitter, Input, Output } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { StripeService } from '../Services/stripe.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stripe-payments',
  templateUrl: './stripe-payments.component.html',
  styleUrls:[ './stripe-payments.component.css']
})
export class StripePaymentsComponent {
  @Input() amount = 0;
  @Input() customerName = '';
  @Input() customerEmail = '';
  @Input() customerPhone = '';
  @Input() currency: string = 'USD'; // 👈 MUST exist
  @Output() paymentSuccess = new EventEmitter<any>();
  @Output() paymentFail = new EventEmitter<any>();

  selectedPaymentMethod = 'flutterwave';
  selectedChannel = 'card';
  // currency = 'USD';
  isLoading = false;

  constructor(private stripeService: StripeService, private http: HttpClient) {}

  ngOnInit(): void {
    this.detectLocationAndSetCurrency();
  }

  detectLocationAndSetCurrency(): void {
    this.http.get<any>('https://ipapi.co/json/').subscribe({
      next: (res) => {
        const country = res?.country_name?.toLowerCase();
        if (country.includes('rwanda')) {
          this.currency = 'RWF';
          this.selectedChannel = 'mobilemoneyrwanda';
        } else if (country.includes('south sudan')) {
          this.currency = 'SSP';
          this.selectedChannel = 'mobilemoneyghana';
        } else {
          this.currency = 'USD';
          this.selectedChannel = 'card';
        }
      },
      error: () => (this.currency = 'USD')
    });
  }

  processPayment(): void {
    if (this.selectedPaymentMethod === 'cash') {
      alert('You selected cash. Please pay on delivery.');
      this.paymentSuccess.emit('cash');
      return;
    }

    if (!this.customerName || !this.customerEmail || !this.amount) {
      alert('All fields are required.');
      return;
    }

    if (this.selectedChannel.includes('mobilemoney') && !this.customerPhone) {
      alert('Phone number required for MoMo payments.');
      return;
    }

    const txRef = 'tx-' + Date.now();
    const payload = {
      name: this.customerName,
      email: this.customerEmail,
      phone_number: this.customerPhone,
      amount: this.amount,
      currency: this.currency,
      channel: this.selectedChannel,
    };

    this.isLoading = true;

    this.stripeService.initiatePayment(payload).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res?.data?.link) {
          // @ts-ignore
          FlutterwaveCheckout({
            public_key: 'FLWPUBK_TEST-695e1fe57a0583aec25162dd3217f95c-X',
            tx_ref: txRef,
            amount: this.amount,
            currency: this.currency,
            payment_options: this.selectedChannel,
            customer: {
              email: this.customerEmail,
              name: this.customerName,
              phonenumber: this.customerPhone,
            },
            customizations: {
              title: 'Trip Payment',
              description: 'Book ride with Flutterwave',
            },
            callback: (response: any) => {
              if (response.status === 'successful') {
                this.paymentSuccess.emit(response);
              } else {
                this.paymentFail.emit(response);
              }
            },
            onclose: () => console.log('Modal closed'),
          });
        } else {
          alert('❌ Payment link error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        alert('❌ Payment initiation failed');
        console.error(err);
      }
    });
  }
}
