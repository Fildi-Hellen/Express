import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecipientService {
  constructor() { }

  shareRecipientInfo(recipient: { name: string, phone: string }) {
    // Logic to share recipient information with Expressud automatically
    console.log('Recipient information shared:', recipient);
  }
}
