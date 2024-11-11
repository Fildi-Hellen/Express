import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {
  @Output() paymentMethodSelected = new EventEmitter<string>();

  selectedPaymentMethod: string = '';
  paymentMethods: string[] = [ 'Pay with Cash'];

  updatePaymentMethod(): void {
    this.paymentMethodSelected.emit(this.selectedPaymentMethod);
  }


}

