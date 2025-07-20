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
}

interface CallStatus {
  isActive: boolean;
  caller?: string;
  recipient?: string;
  status: 'ringing' | 'connected' | 'ended';
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
  newMessage: string = '';
  currentUserId: number = 0;
  isLoading: boolean = false;
  callStatus: CallStatus = { isActive: false, status: 'ended' };
  
  private messageSubscription?: Subscription;
  private callSubscription?: Subscription;

  constructor(
    private messagingService: MessagingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get driverId from route parameters
    this.route.params.subscribe(params => {
      this.driverId = +params['driverId']; // + converts string to number
      console.log('Driver ID from route:', this.driverId);
      
      // Initialize messaging after getting driverId
      this.getCurrentUser();
      this.loadMessages();
      this.subscribeToMessages();
      this.subscribeToCallStatus();
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.callSubscription) {
      this.callSubscription.unsubscribe();
    }
  }

  getCurrentUser(): void {
    // Simple implementation using localStorage
    const userId = localStorage.getItem('userId');
    this.currentUserId = userId ? parseInt(userId, 10) : 1; // Default to 1 for testing
  }

  loadMessages(): void {
    if (!this.driverId) return;
    
    this.isLoading = true;
    this.messagingService.getConversation(this.driverId).subscribe({
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
        if (message.sender_id === this.driverId || message.recipient_id === this.driverId) {
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
    if (!this.newMessage.trim() || !this.driverId) return;

    const message: Message = {
      sender_id: this.currentUserId,
      recipient_id: this.driverId,
      content: this.newMessage.trim(),
      sender_type: 'user'
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

  // Test data methods for messaging system
  loadTestData(): void {
    // Sample test messages for user-driver communication testing
    const testMessages: Message[] = [
      {
        id: 1,
        sender_id: this.currentUserId,
        recipient_id: this.driverId || 5, // Default driver ID for testing
        content: "Hi! I just booked a ride. Are you on your way?",
        created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        sender_type: 'user'
      },
      {
        id: 2,
        sender_id: this.driverId || 5,
        recipient_id: this.currentUserId,
        content: "Hello! Yes, I'm about 3 minutes away. I can see your location.",
        created_at: new Date(Date.now() - 240000).toISOString(), // 4 minutes ago
        sender_type: 'driver'
      },
      {
        id: 3,
        sender_id: this.currentUserId,
        recipient_id: this.driverId || 5,
        content: "Great! I'm wearing a red jacket and waiting by the main entrance.",
        created_at: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
        sender_type: 'user'
      },
      {
        id: 4,
        sender_id: this.driverId || 5,
        recipient_id: this.currentUserId,
        content: "Perfect! I can see you. I'm driving the blue Honda with plate number XYZ-456.",
        created_at: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
        sender_type: 'driver'
      },
      {
        id: 5,
        sender_id: this.currentUserId,
        recipient_id: this.driverId || 5,
        content: "Thank you! I'm getting in now. The destination is still the same, right?",
        created_at: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
        sender_type: 'user'
      },
      {
        id: 6,
        sender_id: this.driverId || 5,
        recipient_id: this.currentUserId,
        content: "Yes, confirmed! ETA is about 12 minutes. Would you like some music?",
        created_at: new Date().toISOString(), // now
        sender_type: 'driver'
      }
    ];

    // Set a test driver ID if none exists
    if (!this.driverId) {
      this.driverId = 5; // Test driver ID
    }

    // Load test messages
    this.messages = testMessages;
    this.scrollToBottom();
    
    // Show success message
    alert('Test data loaded successfully! You can now test the user-driver messaging system.');
  }

  clearMessages(): void {
    this.messages = [];
    alert('All messages cleared!');
  }

  simulateDriverCall(): void {
    // Simulate an incoming call from the driver
    this.callStatus = {
      isActive: true,
      caller: 'driver',
      recipient: 'user',
      status: 'ringing'
    };
    
    alert('Simulating incoming call from driver! You can now test answering the call.');
  }

  loadTestCallScenario(): void {
    // Ensure we have a test driver
    if (!this.driverId) {
      this.driverId = 5;
    }
    
    // Load a few messages first
    this.loadTestData();
    
    // Then simulate a call after a brief delay
    setTimeout(() => {
      this.simulateDriverCall();
    }, 2000);
  }

  // Utility method to round up fare to whole number (for ride completion)
  roundUpFare(fare: number): number {
    return Math.ceil(fare);
  }
}
