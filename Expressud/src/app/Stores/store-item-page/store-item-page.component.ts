import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OrderService } from 'src/app/Services/order.service';


@Component({
  selector: 'app-store-item-page',
  templateUrl: './store-item-page.component.html',
  styleUrls: ['./store-item-page.component.css'] 
})
export class StoreItemPageComponent  {
  fullName = '';
  locationAddress = '';
  contact = '';
  selectedMapAddress: string | null = null;

  constructor(private http: HttpClient, private orderService: OrderService) {}

  @Output() addressUpdated = new EventEmitter<{
    fullName: string;
    locationAddress: string;
    contact: string;
  }>();

  setAddressFromMap(address: string): void {
    this.selectedMapAddress = address;
    this.locationAddress = address;
  }

  saveAddress(): void {
    const resolvedAddress = this.locationAddress || this.selectedMapAddress || '';
    if (!this.fullName || !resolvedAddress || !this.contact) {
      alert('Please fill in all fields or select an address from the map and provide a phone number.');
      return;
    }

    const addressData = {
      fullName: this.fullName,
      locationAddress: resolvedAddress,
      contact: this.contact,
    };

    this.orderService.saveAddress(addressData).subscribe(
      (response) => {
        console.log('Address saved successfully:', response);
        alert('Address saved successfully!');
        this.addressUpdated.emit(addressData);
      },
      (error) => {
        console.error('Error saving address:', error);
        alert('Failed to save address!');
      }
    );
  }
  
}