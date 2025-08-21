import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagingService } from '../../Services/messaging.service';
import { Subscription } from 'rxjs';

interface Message {
  id?: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at?: string;
  sender_type: 'user' | 'driver';
  message?: string;
  text?: string;
  [key: string]: any;
}

type CallState = 'ringing' | 'connected' | 'ended';

interface CallStatus {
  isActive: boolean;
  caller?: 'user' | 'driver';
  recipient?: 'user' | 'driver';
  status: CallState;
}

@Component({
  selector: 'app-messaging',
  standalone: false,
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit, OnDestroy {
  driverId!: number;
  rideId?: number;

  messages: Message[] = [];
  newMessage = '';
  currentUserId = 0;
  isLoading = false;

  // Initialize with a safe default so it's never null/undefined.
  callStatus: CallStatus = { isActive: false, status: 'ended' };

  showDebugInfo = false;

  private messageSubscription?: Subscription;
  private callSubscription?: Subscription;

  constructor(
    private messagingService: MessagingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.driverId = +params['driverId'];
      this.getCurrentUser();
      this.loadMessages();
      this.subscribeToMessages();
      this.subscribeToCallStatus();
    });
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
    this.callSubscription?.unsubscribe();
  }

  getCurrentUser(): void {
    const userId = localStorage.getItem('userId');
    this.currentUserId = userId ? parseInt(userId, 10) : 1;

    if (!this.currentUserId || this.currentUserId === 0) {
      this.currentUserId = 1;
      localStorage.setItem('userId', '1');
    }
  }

  loadMessages(): void {
    if (!this.driverId) return;

    this.isLoading = true;
    this.messagingService.getConversation(this.driverId).subscribe({
      next: (messages) => {
        this.messages = messages || [];
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.isLoading = false;
        this.messages = [];
      }
    });
  }

  subscribeToMessages(): void {
    if (!this.driverId) return;

    this.messageSubscription = this.messagingService
      .subscribeToConversation(this.driverId)
      .subscribe({
        next: (messages) => {
          this.messages = messages || [];
          this.scrollToBottom();
        },
        error: () => {}
      });
  }

  subscribeToCallStatus(): void {
    this.callSubscription = this.messagingService.onCallStatus().subscribe({
      next: (status) => {
        // Fallback to safe default if service emits null/undefined
        this.callStatus = status ?? { isActive: false, status: 'ended' };
      },
      error: () => {}
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.driverId) return;

    const message: Message = {
      id: Date.now(),
      sender_id: this.currentUserId,
      recipient_id: this.driverId,
      content: this.newMessage.trim(),
      sender_type: 'user',
      created_at: new Date().toISOString()
    };

    this.messages.push(message);
    const sentContent = this.newMessage.trim();
    this.newMessage = '';
    this.scrollToBottom();

    this.messagingService.sendMessage(message).subscribe({
      next: (response) => {
        // Update last optimistic message with server response
        const last = this.messages[this.messages.length - 1];
        if (last && last.content === sentContent) {
          Object.assign(last, response);
        }
      },
      error: () => {
        // keep optimistic message; optionally mark as failed
      }
    });
  }

  makeCall(): void {
    if (!this.driverId) return;

    this.messagingService.makeCall(this.driverId).subscribe({
      next: () => {
        this.callStatus = {
          isActive: true,
          caller: 'user',
          recipient: 'driver',
          status: 'ringing'
        };
      },
      error: () => {
        alert('Failed to make call. Please try again.');
      }
    });
  }

  endCall(): void {
    this.messagingService.endCall().subscribe({
      next: () => {
        this.callStatus = { isActive: false, status: 'ended' };
      },
      error: () => {}
    });
  }

  answerCall(): void {
    this.messagingService.answerCall().subscribe({
      next: () => {
        this.callStatus.status = 'connected';
      },
      error: () => {}
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages') as HTMLElement | null;
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

  // Test helpers
  loadTestData(): void {
    if (!this.currentUserId) this.currentUserId = 1;
    if (!this.driverId) this.driverId = 5;
    this.messagingService.loadTestConversation(this.driverId);
    alert(`✅ Test conversation loaded!\nCustomer ID: ${this.currentUserId}\nDriver ID: ${this.driverId}`);
  }

  clearMessages(): void {
    this.messagingService.clearAllConversations();
    this.messages = [];
    alert('✅ All conversations cleared!');
  }

  simulateDriverCall(): void {
    this.callStatus = { isActive: true, caller: 'driver', recipient: 'user', status: 'ringing' };
    alert('Simulating incoming call from driver.');
  }

  loadTestCallScenario(): void {
    if (!this.driverId) this.driverId = 5;
    this.loadTestData();
    setTimeout(() => this.simulateDriverCall(), 2000);
  }

  roundUpFare(fare: number): number {
    return Math.ceil(fare);
  }

  // UI helpers
  getMessageClass(message: Message): string {
    return this.isMessageSent(message) ? 'message-sent' : 'message-received';
  }

  isMessageSent(message: Message): boolean {
    return message.sender_id === this.currentUserId ||
           (message.sender_type === 'user' && this.currentUserId > 0);
  }

  getMessageContent(message: Message): string {
    return message.content || message.message || message.text || 'No message content';
  }

  formatMessageTime(timestamp: string | undefined): string {
    if (!timestamp) return '';
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return messageDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  toggleDebugInfo(): void {
    this.showDebugInfo = !this.showDebugInfo;
  }

  trackByMessage = (_: number, msg: Message) => msg.id ?? `${msg.sender_id}-${msg.recipient_id}-${msg.created_at ?? ''}`;
}
