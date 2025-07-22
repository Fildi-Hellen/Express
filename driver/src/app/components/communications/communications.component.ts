import { Component, OnDestroy, OnInit } from '@angular/core';
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
    selector: 'app-communications',
    templateUrl: './communications.component.html',
    styleUrls: ['./communications.component.css'],
    standalone: false
})
export class CommunicationsComponent implements OnInit, OnDestroy {
    messages: Message[] = [];
    newMessage: string = '';
    currentDriverId: number = 0;
    currentUserId: number = 0; // Will be set dynamically based on active ride/customer
    messageSubscription!: Subscription;
    callSubscription!: Subscription;
    callStatus: CallStatus = { isActive: false, status: 'ended' };
    isLoading: boolean = false;
    
    constructor(private messagingService: MessagingService) {}
  
    ngOnInit(): void {
      this.getCurrentDriver();
      this.loadMessages();
      this.subscribeToMessages();
      this.subscribeToCallStatus();
    }

    getCurrentDriver(): void {
      const driverId = localStorage.getItem('driverId');
      this.currentDriverId = driverId ? parseInt(driverId, 10) : 1; // Default to 1 for testing
      
      // Get active customer ID from route or ride data
      this.getActiveCustomerId();
    }

    getActiveCustomerId(): void {
      // Try to get customer ID from various sources
      const urlParams = new URLSearchParams(window.location.search);
      const customerIdFromUrl = urlParams.get('customerId');
      
      if (customerIdFromUrl) {
        this.currentUserId = parseInt(customerIdFromUrl, 10);
        console.log('✅ Customer ID from URL:', this.currentUserId);
        return;
      }
      
      // Try to get from localStorage (active ride)
      const activeCustomerId = localStorage.getItem('activeCustomerId');
      if (activeCustomerId) {
        this.currentUserId = parseInt(activeCustomerId, 10);
        console.log('✅ Customer ID from storage:', this.currentUserId);
        return;
      }
      
      // Default for testing
      this.currentUserId = 2;
      console.log('🔧 Using default customer ID for testing:', this.currentUserId);
    }

    loadMessages(): void {
      if (!this.currentUserId) return;
      
      this.isLoading = true;
      this.messagingService.getConversation(this.currentUserId).subscribe({
        next: (messages) => {
          this.messages = messages || [];
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
          if (message.sender_id === this.currentUserId || message.recipient_id === this.currentUserId) {
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
          if (status) {
            this.callStatus = status;
          }
        },
        error: (error) => {
          console.error('Error receiving call status:', error);
        }
      });
    }
  
    sendMessage(): void {
      if (!this.newMessage.trim() || !this.currentUserId) {
        console.warn('Cannot send message - missing content or customer ID');
        return;
      }
      
      if (!this.currentDriverId) {
        console.warn('Cannot send message - missing driver ID');
        this.getCurrentDriver();
        return;
      }
  
      const message: Message = {
        sender_id: this.currentDriverId,
        recipient_id: this.currentUserId,
        content: this.newMessage.trim(),
        sender_type: 'driver'
      };
  
      console.log('📤 Sending message:', message);
  
      // Add message immediately to UI for instant feedback
      const tempMessage = { ...message, id: Date.now(), created_at: new Date().toISOString() };
      this.messages.push(tempMessage);
      const sentContent = this.newMessage.trim();
      this.newMessage = '';
      this.scrollToBottom();
      
      // Send via service
      this.messagingService.sendMessage(message).subscribe({
        next: (response) => {
          console.log('✅ Message sent successfully:', response);
          // Update the temporary message with server response
          const lastMessage = this.messages[this.messages.length - 1];
          if (lastMessage.content === sentContent) {
            Object.assign(lastMessage, response);
          }
        },
        error: (error) => {
          console.error('❌ Error sending message:', error);
          // Don't remove message from UI - it will still work via shared storage
          console.log('💡 Message still visible via local storage');
        }
      });
    }
  
    makeCall(): void {
      if (!this.currentUserId) {
        alert('No customer to call');
        return;
      }
  
      this.messagingService.makeCall(this.currentUserId).subscribe({
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

    loadTestData(): void {
    // Ensure we have valid IDs
    if (!this.currentDriverId) this.currentDriverId = 1;
    if (!this.currentUserId) this.currentUserId = 2;
    
    console.log('🧪 Loading test data - Driver:', this.currentDriverId, 'Customer:', this.currentUserId);
    
    // Sample test messages for driver communications testing
    const testMessages: Message[] = [
    {
    id: 1,
        sender_id: this.currentUserId,
            recipient_id: this.currentDriverId,
                content: "Hi! I'm waiting at the pickup location. Where are you?",
                created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
                sender_type: 'user'
            },
            {
                id: 2,
                sender_id: this.currentDriverId,
                recipient_id: this.currentUserId,
                content: "Hello! I'm about 2 minutes away. I can see the location on my map.",
                created_at: new Date(Date.now() - 240000).toISOString(), // 4 minutes ago
                sender_type: 'driver'
            },
            {
                id: 3,
                sender_id: this.currentUserId,
                recipient_id: this.currentDriverId,
                content: "Great! I'm wearing a blue jacket and standing near the coffee shop.",
                created_at: new Date(Date.now() - 180000).toISOString(), // 3 minutes ago
                sender_type: 'user'
            },
            {
                id: 4,
                sender_id: this.currentDriverId,
                recipient_id: this.currentUserId,
                content: "Perfect! I can see you now. I'm in the white Toyota with license plate ABC-123.",
                created_at: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
                sender_type: 'driver'
            },
            {
                id: 5,
                sender_id: this.currentUserId,
                recipient_id: this.currentDriverId,
                content: "Thank you! Getting in now. Could you please turn up the AC a bit?",
                created_at: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
                sender_type: 'user'
            },
            {
                id: 6,
                sender_id: this.currentDriverId,
                recipient_id: this.currentUserId,
                content: "Of course! AC is now on high. Estimated arrival time is 15 minutes.",
                created_at: new Date().toISOString(), // now
                sender_type: 'driver'
            }
        ];

        // Load test messages
        this.messages = testMessages;
        this.scrollToBottom();
        
        // Store active customer ID for session
        localStorage.setItem('activeCustomerId', this.currentUserId.toString());
        
        // Show success message
        alert(`✅ Test data loaded successfully!\n\nDriver ID: ${this.currentDriverId}\nCustomer ID: ${this.currentUserId}\n\nYou can now test the messaging system.`);
    }

    clearMessages(): void {
        this.messages = [];
        alert('All messages cleared!');
    }

    simulateIncomingCall(): void {
        // Simulate an incoming call from the test user
        this.callStatus = {
            isActive: true,
            caller: 'user',
            recipient: 'driver',
            status: 'ringing'
        };
        
        alert('Simulating incoming call from customer! You can now test answering the call.');
    }

    loadTestCallScenario(): void {
        // Ensure we have a test user
        if (!this.currentUserId) {
            this.currentUserId = 2;
        }
        if (!this.currentDriverId) {
            this.currentDriverId = 1;
        }
        
        // Load a few messages first
        this.loadTestData();
        
        // Then simulate a call after a brief delay
        setTimeout(() => {
            this.simulateIncomingCall();
        }, 2000);
    }

    // Utility method to round up fare to whole number
    roundUpFare(fare: number): number {
        return Math.ceil(fare);
    }

    // Test method to demonstrate fare rounding
    testFareRounding(): void {
        const testFares = [12.34, 8.67, 15.99, 20.01, 5.00];
        const roundedFares = testFares.map(fare => this.roundUpFare(fare));
        
        console.log('Original fares:', testFares);
        console.log('Rounded up fares:', roundedFares);
        
        alert(`Fare rounding test:\nOriginal: ${testFares.join(', ')}\nRounded: ${roundedFares.join(', ')}`);
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            const messagesContainer = document.querySelector('.messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }, 100);
    }

    onKeyPress(event: KeyboardEvent): void {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    }
  
    ngOnDestroy(): void {
      if (this.messageSubscription) {
        this.messageSubscription.unsubscribe();
      }
      if (this.callSubscription) {
        this.callSubscription.unsubscribe();
      }
    }
}
