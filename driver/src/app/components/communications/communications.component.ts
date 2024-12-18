import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../Services/chat.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-communications',
    templateUrl: './communications.component.html',
    styleUrls: ['./communications.component.css'],
    standalone: false
})
export class CommunicationsComponent implements OnInit, OnDestroy{
    messages: any[] = [];
    newMessage: string = '';
    currentDriverId: string = 'driver123';
    messageSubscription!: Subscription;
    callSubscription!: Subscription;
    callStatus: string = '';
  
    constructor(private chatService: ChatService) {}
  
    ngOnInit(): void {
      this.messageSubscription = this.chatService.getMessages().subscribe(message => {
        if (message.recipientId === this.currentDriverId || message.senderId === this.currentDriverId) {
          this.messages.push(message);
        }
      });
  
      this.callSubscription = this.chatService.onCallStatus().subscribe(status => {
        this.callStatus = status.status;
      });
    }
  
    sendMessage(): void {
      if (this.newMessage.trim()) {
        const message = {
          senderId: this.currentDriverId,
          content: this.newMessage,
          recipientId: 'customer123' // Dynamic based on context
        };
        this.chatService.sendMessage(message);
        this.newMessage = '';
      }
    }
  
   // In communications.component.ts
    makeCall(recipientId: string): void {
    this.callStatus = "Dialing..."; // Update status to Dialing when the call is initiated
    this.chatService.makeCall({ from: this.currentDriverId, to: recipientId }).then(() => {
      this.callStatus = "Connected"; // Assume connection is successful for demonstration
    }).catch((error: any) => {
      this.callStatus = "Failed to connect"; // Handle errors or failed connection scenarios
      console.error('Call failed:', error.message);
    });
  }
  
  
    ngOnDestroy(): void {
      this.messageSubscription.unsubscribe();
      this.callSubscription.unsubscribe();
    }


}
