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
  // Allow additional properties for flexibility
  message?: string;
  text?: string;
  [key: string]: any;
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
  showDebugInfo: boolean = false; // Set to true for debugging
  
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
    
    console.log('👤 Current user ID set to:', this.currentUserId);
    
    // Ensure we have a valid user ID for testing
    if (!this.currentUserId || this.currentUserId === 0) {
      this.currentUserId = 1;
      localStorage.setItem('userId', '1');
      console.log('🔧 Set default user ID to 1 for testing');
    }
  }

  loadMessages(): void {
    if (!this.driverId) {
      console.warn('No driver ID available for loading messages');
      return;
    }
    
    this.isLoading = true;
    console.log('Loading messages for driver:', this.driverId);
    
    // For now, we'll use a try-catch to handle any service errors
    try {
      this.messagingService.getConversation(this.driverId).subscribe({
        next: (messages) => {
          this.messages = messages || [];
          this.isLoading = false;
          this.scrollToBottom();
          console.log('Messages loaded:', this.messages.length);
        },
        error: (error) => {
          console.error('Error loading messages:', error);
          this.isLoading = false;
          // Set empty messages array on error
          this.messages = [];
        }
      });
    } catch (error) {
      console.error('Error in loadMessages:', error);
      this.isLoading = false;
      this.messages = [];
    }
  }

  subscribeToMessages(): void {
    if (!this.driverId) {
      console.warn('No driver ID available for subscribing to messages');
      return;
    }

    try {
      // Subscribe to live conversation updates using shared storage
      this.messageSubscription = this.messagingService.subscribeToConversation(this.driverId).subscribe({
        next: (messages) => {
          console.log('🔔 Customer received message updates:', messages.length);
          this.messages = messages || [];
          this.scrollToBottom();
        },
        error: (error) => {
          console.error('Error receiving message updates:', error);
        }
      });
    } catch (error) {
      console.error('Error subscribing to messages:', error);
    }
  }

  subscribeToCallStatus(): void {
    try {
      this.callSubscription = this.messagingService.onCallStatus().subscribe({
        next: (status) => {
          this.callStatus = status || { isActive: false, status: 'ended' };
        },
        error: (error) => {
          console.error('Error receiving call status:', error);
        }
      });
    } catch (error) {
      console.error('Error subscribing to call status:', error);
    }
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.driverId) return;

    const message: Message = {
      id: Date.now(), // Temporary ID
      sender_id: this.currentUserId,
      recipient_id: this.driverId,
      content: this.newMessage.trim(),
      sender_type: 'user',
      created_at: new Date().toISOString()
    };

    console.log('💬 Sending message:', message);
    console.log('🔍 Current user ID:', this.currentUserId);
    console.log('🔍 Message will be classified as:', this.getMessageClass(message));

    // Add message immediately to UI for instant feedback
    this.messages.push(message);
    const sentContent = this.newMessage.trim();
    this.newMessage = '';
    this.scrollToBottom();

    // Try to send via service, but don't fail if service is unavailable
    this.messagingService.sendMessage(message).subscribe({
      next: (response) => {
        console.log('✅ Message sent successfully via service:', response);
        // Update the message with server response if needed
        const lastMessage = this.messages[this.messages.length - 1];
        if (lastMessage.content === sentContent) {
          // Update with server response data
          Object.assign(lastMessage, response);
        }
      },
      error: (error) => {
        console.error('⚠️ Service unavailable, but message shown in UI:', error);
        // Don't remove the message from UI, just log the error
        // In a real app, you might want to mark the message as "pending" or "failed"
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
    console.log('🧪 Customer loadTestData() called!');
    console.log('Current driverId:', this.driverId);
    console.log('Current userId:', this.currentUserId);
    
    // Ensure we have proper IDs for testing
    if (!this.currentUserId) {
      this.currentUserId = 1;
      console.log('Set default currentUserId to:', this.currentUserId);
    }
    if (!this.driverId) {
      this.driverId = 5; // Set default driver ID for testing
      console.log('Set default driverId to:', this.driverId);
    }
    
    // Use shared storage to load test conversation
    this.messagingService.loadTestConversation(this.driverId);
    
    // Show success message
    alert(`✅ Test conversation loaded via shared storage!\n\nCustomer ID: ${this.currentUserId}\nDriver ID: ${this.driverId}\n\nMessages will appear in both customer and driver apps!`);
  }

  clearMessages(): void {
    console.log('🗑️ Customer clearMessages() called!');
    
    // Clear from shared storage (affects both customer and driver)
    this.messagingService.clearAllConversations();
    
    // Clear local display
    this.messages = [];
    
    console.log('All conversations cleared from shared storage');
    alert('✅ All conversations cleared from shared storage!\n\nThis affects both customer and driver apps.');
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

  // iMessage-style helper methods
  getMessageClass(message: Message): string {
    const isSent = this.isMessageSent(message);
    return isSent ? 'message-sent' : 'message-received';
  }

  isMessageSent(message: Message): boolean {
    // Check if the message is sent by the current user
    // Use multiple checks to ensure accuracy
    return message.sender_id === this.currentUserId || 
           (message.sender_type === 'user' && this.currentUserId > 0);
  }

  getMessageContent(message: Message): string {
    // Get the actual message content from various possible properties
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
    
    // For older messages, show the time
    return messageDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  toggleDebugInfo(): void {
    this.showDebugInfo = !this.showDebugInfo;
  }
}
