import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';
import { StoreService } from 'src/app/Services/store.service';

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

  constructor(private http: HttpClient) {}

  setAddressFromMap(address: string): void {
    this.selectedMapAddress = address;
    this.locationAddress = address;
  }

  saveAddress(): void {
    if (!this.fullName || (!this.locationAddress && !this.selectedMapAddress) || (!this.contact && this.selectedMapAddress)) {
      alert('Please fill in all fields or select an address from the map and provide a phone number.');
      return;
    }

    const addressData = {
      fullName: this.fullName,
      address: this.locationAddress || this.selectedMapAddress,
      contact: this.contact,
    };

    this.http.post('/api/address', addressData).subscribe(
      (response) => {
        console.log('Address saved successfully', response);
        alert('Address saved successfully!');
      },
      (error) => {
        console.error('Error saving address', error);
        alert('Failed to save address!');
      }
    );
  }
  
}
