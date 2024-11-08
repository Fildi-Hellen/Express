import { Component } from '@angular/core';
import { RecipientService } from 'src/app/Services/recipient.service';

@Component({
  selector: 'app-recipient',
  templateUrl: './recipient.component.html',
  styleUrl: './recipient.component.css'
})
export class RecipientComponent {
  recipient = { name: '', phone: '' };

  constructor(private recipientService: RecipientService) {}

  saveRecipient() {
    // Save recipient information
    this.recipientService.shareRecipientInfo(this.recipient);
  }

}
