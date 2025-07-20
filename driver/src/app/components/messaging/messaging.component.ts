import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MessagingService } from '../../Services/messaging.service';
import { DriverService } from '../../Services/driver.service';
import { Subscription } from 'rxjs';

interface Message {
  id?: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at?: string;
  sender_type: 'user' | 'driver';
}

interface CallStatus {
  isActive: boolean;
  caller?: string;
  recipient?: string;
  status: 'ringing' | 'connected' | 'ended';
}

@Component({
  selector: 'app-driver-messaging',
  standalone: false,
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class DriverMessagingComponent implements OnInit, OnDestroy {
  @Input() userId!: number;
  @Input() rideId!: number;
  
  messages: Message[] = [];
  newMessage: string = '';
  currentDriverId: number = 0;
  isLoading: boolean = false;
  callStatus: CallStatus = { isActive: false, status: 'ended' };
  
  private messageSubscription?: Subscription;
  private callSubscription?: Subscription;

  constructor(
    private messagingService: MessagingService,
    private driverService: DriverService
  ) {}

  ngOnInit(): void {
    this.getCurrentDriver();
    this.loadMessages();
    this.subscribeToMessages();
    this.subscribeToCallStatus();
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.callSubscription) {
      this.callSubscription.unsubscribe();
    }
  }

  getCurrentDriver(): void {
    const driverId = localStorage.getItem('driverId');
    this.currentDriverId = driverId ? parseInt(driverId, 10) : 0;
  }

  loadMessages(): void {
    if (!this.userId) return;
    
    this.isLoading = true;
    this.messagingService.getConversation(this.userId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.isLoading = false;
      }
    });
  }

  subscribeToMessages(): void {
    this.messageSubscription = this.messagingService.onNewMessage().subscribe({
      next: (message) => {
        if (message.sender_id === this.userId || message.recipient_id === this.userId) {
          this.messages.push(message);
          this.scrollToBottom();
        }
      },
      error: (error) => {
        console.error('Error receiving message:', error);
      }
    });
  }

  subscribeToCallStatus(): void {
    this.callSubscription = this.messagingService.onCallStatus().subscribe({
      next: (status) => {
        this.callStatus = status;
      },
      error: (error) => {
        console.error('Error receiving call status:', error);
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.userId) return;

    const message: Message = {
      sender_id: this.currentDriverId,
      recipient_id: this.userId,
      content: this.newMessage.trim(),
      sender_type: 'driver'
    };

    this.messagingService.sendMessage(message).subscribe({
      next: (response) => {
        this.messages.push(response);
        this.newMessage = '';
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again.');
      }
    });
  }

  makeCall(): void {
    if (!this.userId) return;

    this.messagingService.makeCall(this.userId).subscribe({
      next: () => {
        this.callStatus = {
          isActive: true,
          caller: 'driver',
          recipient: 'user',
          status: 'ringing'
        };
      },
      error: (error) => {
        console.error('Error making call:', error);
        alert('Failed to make call. Please try again.');
      }
    });
  }

  endCall(): void {
    this.messagingService.endCall().subscribe({
      next: () => {
        this.callStatus = { isActive: false, status: 'ended' };
      },
      error: (error) => {
        console.error('Error ending call:', error);
      }
    });
  }

  answerCall(): void {
    this.messagingService.answerCall().subscribe({
      next: () => {
        this.callStatus.status = 'connected';
      },
      error: (error) => {
        console.error('Error answering call:', error);
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}

// Export with alias for backward compatibility
export { DriverMessagingComponent as MessagingComponent };
