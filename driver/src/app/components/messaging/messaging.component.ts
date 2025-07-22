import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MessagingService } from '../../Services/messaging.service';
import { DriverService } from '../../Services/driver.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface Message {
  id?: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at?: string;
  sender_type: 'user' | 'driver';
  sender?: {
    id: number;
    name: string;
    email?: string;
  };
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
  availableCustomers: any[] = [];
  selectedCustomerId: number = 0;
  isLoading: boolean = false;
  callStatus: CallStatus = { isActive: false, status: 'ended' };
  showDebugInfo: boolean = true; // Enable for debugging
  connectionStatus: string = 'Initializing...';
  
  private messageSubscription?: Subscription;
  private callSubscription?: Subscription;

  constructor(
    private messagingService: MessagingService,
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🚗 Driver messaging component initialized');
    
    // Initialize driver ID
    this.getCurrentDriver();
    
    // Get customer ID from route parameters or input
    this.route.params.subscribe(params => {
      if (params['userId'] || params['customerId']) {
        this.userId = +params['userId'] || +params['customerId'];
        this.selectedCustomerId = this.userId;
        console.log('👤 Customer ID from route:', this.userId);
        this.initializeMessaging();
      } else if (this.userId) {
        this.selectedCustomerId = this.userId;
        this.initializeMessaging();
      } else {
        // Load available customers for selection
        this.loadAvailableCustomers();
      }
    });

    // Check query parameters for customer ID
    this.route.queryParams.subscribe(params => {
      if (params['customerId'] && !this.userId) {
        this.userId = +params['customerId'];
        this.selectedCustomerId = this.userId;
        console.log('👤 Customer ID from query params:', this.userId);
        this.initializeMessaging();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    if (this.callSubscription) {
      this.callSubscription.unsubscribe();
    }
    this.messagingService.disconnect();
  }

  getCurrentDriver(): void {
    this.currentDriverId = this.messagingService.getCurrentDriverId();
    console.log('🚗 Current driver ID:', this.currentDriverId);
    
    if (!this.currentDriverId || this.currentDriverId === 0) {
      this.currentDriverId = 1; // Default for testing
      localStorage.setItem('driverId', '1');
      console.log('🔧 Set default driver ID to 1 for testing');
    }
  }

  loadAvailableCustomers(): void {
    console.log('👥 Loading available customers...');
    this.connectionStatus = 'Loading customers...';
    
    // Create some test customers for selection
    this.availableCustomers = [
      { id: 2, name: 'Test Customer 1', phone: '123-456-7890', status: 'active' },
      { id: 3, name: 'Test Customer 2', phone: '098-765-4321', status: 'active' },
      { id: 4, name: 'John Doe', phone: '555-123-4567', status: 'active' },
      { id: 5, name: 'Jane Smith', phone: '555-987-6543', status: 'active' }
    ];
    
    // Try to get real customers from API if available
    this.messagingService.getAllConversations().subscribe({
      next: (response) => {
        if (response.success && response.data.length > 0) {
          console.log('📋 Found existing conversations:', response.data);
          // Extract unique customer IDs from conversations
          const customerIds = new Set<number>();
          response.data.forEach((conv: any) => {
            if (conv.sender_type === 'user') {
              customerIds.add(conv.sender_id);
            } else if (conv.sender_type === 'driver') {
              customerIds.add(conv.recipient_id);
            }
          });
          
          // Add to available customers
          customerIds.forEach(id => {
            if (!this.availableCustomers.find(c => c.id === id)) {
              this.availableCustomers.push({
                id: id,
                name: `Customer ${id}`,
                phone: `Phone ${id}`,
                status: 'active'
              });
            }
          });
        }
        this.connectionStatus = 'Ready to chat';
      },
      error: (error) => {
        console.error('⚠️ Could not load conversations:', error);
        this.connectionStatus = 'Ready to chat (offline mode)';
      }
    });
  }

  selectCustomer(customerId: number): void {
    console.log('👤 Selected customer:', customerId);
    this.userId = customerId;
    this.selectedCustomerId = customerId;
    
    // Update URL to reflect selected customer
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { customerId: customerId },
      queryParamsHandling: 'merge'
    });
    
    this.initializeMessaging();
  }

  initializeMessaging(): void {
    if (!this.userId) {
      console.warn('⚠️ No customer ID available for messaging');
      return;
    }
    
    console.log('🚀 Initializing messaging with customer:', this.userId);
    this.connectionStatus = 'Connecting...';
    
    this.loadMessages();
    this.subscribeToMessages();
    this.subscribeToCallStatus();
    
    this.connectionStatus = 'Connected';
  }

  loadMessages(): void {
    if (!this.userId) {
      console.warn('No customer ID available for loading messages');
      return;
    }
    
    this.isLoading = true;
    console.log('📥 Loading messages for customer:', this.userId);
    
    this.messagingService.getConversation(this.userId).subscribe({
      next: (messages) => {
        this.messages = messages || [];
        this.isLoading = false;
        this.scrollToBottom();
        console.log('✅ Messages loaded:', this.messages.length);
        this.connectionStatus = `Connected (${this.messages.length} messages)`;
      },
      error: (error) => {
        console.error('❌ Error loading messages:', error);
        this.isLoading = false;
        this.messages = [];
        this.connectionStatus = 'Connection error';
      }
    });
  }

  subscribeToMessages(): void {
    if (!this.userId) {
      console.warn('No customer ID available for subscribing to messages');
      return;
    }

    this.messageSubscription = this.messagingService.subscribeToConversation(this.userId).subscribe({
      next: (messages) => {
        console.log('🔔 Driver received message updates:', messages.length);
        this.messages = messages || [];
        this.scrollToBottom();
        this.connectionStatus = `Connected (${this.messages.length} messages)`;
      },
      error: (error) => {
        console.error('❌ Error receiving message updates:', error);
        this.connectionStatus = 'Update error';
      }
    });
  }

  subscribeToCallStatus(): void {
    this.callSubscription = this.messagingService.onCallStatus().subscribe({
      next: (status) => {
        this.callStatus = status || { isActive: false, status: 'ended' };
      },
      error: (error) => {
        console.error('❌ Error receiving call status:', error);
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.userId) {
      console.warn('⚠️ Cannot send message - missing content or customer ID');
      return;
    }

    const message: Message = {
      sender_id: this.currentDriverId,
      recipient_id: this.userId,
      content: this.newMessage.trim(),
      sender_type: 'driver',
      created_at: new Date().toISOString()
    };

    console.log('🚗💬 Sending message:', message);

    const sentContent = this.newMessage.trim();
    this.newMessage = '';

    this.messagingService.sendMessage(message).subscribe({
      next: (response) => {
        console.log('✅ Message sent successfully:', response);
        this.connectionStatus = `Connected (${this.messages.length} messages)`;
      },
      error: (error) => {
        console.error('❌ Error sending message:', error);
        this.connectionStatus = 'Send error';
        // Re-add message content for retry
        this.newMessage = sentContent;
      }
    });
  }

  makeCall(): void {
    if (!this.userId) {
      alert('Please select a customer first');
      return;
    }

    this.messagingService.makeCall(this.userId).subscribe({
      next: () => {
        this.callStatus = {
          isActive: true,
          caller: 'driver',
          recipient: 'user',
          status: 'ringing'
        };
        console.log('📞 Call initiated');
      },
      error: (error) => {
        console.error('❌ Error making call:', error);
        alert('Failed to make call. Please try again.');
      }
    });
  }

  endCall(): void {
    this.messagingService.endCall().subscribe({
      next: () => {
        this.callStatus = { isActive: false, status: 'ended' };
        console.log('📞 Call ended');
      },
      error: (error) => {
        console.error('❌ Error ending call:', error);
      }
    });
  }

  answerCall(): void {
    this.messagingService.answerCall().subscribe({
      next: () => {
        this.callStatus.status = 'connected';
        console.log('📞 Call answered');
      },
      error: (error) => {
        console.error('❌ Error answering call:', error);
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

  // Testing methods
  loadTestData(): void {
    console.log('🧪 Loading test data...');
    
    if (!this.userId) {
      // If no customer selected, use default
      this.userId = 2;
      this.selectedCustomerId = 2;
    }
    
    this.messagingService.loadTestConversation(this.userId);
    
    // Reload messages after creating test data
    setTimeout(() => {
      this.loadMessages();
    }, 1000);
    
    alert(`✅ Test conversation loaded!\n\nDriver ID: ${this.currentDriverId}\nCustomer ID: ${this.userId}\n\nCheck both customer and driver apps!`);
  }

  clearMessages(): void {
    console.log('🗑️ Clearing all messages...');
    
    this.messagingService.clearAllConversations();
    this.messages = [];
    
    alert('✅ All conversations cleared!\n\nThis affects the entire system.');
  }

  createBackendTestData(): void {
    console.log('🛠️ Creating backend test data...');
    
    this.messagingService.createTestData().subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Backend test data created:', response.data);
          
          // Set the test customer ID
          this.userId = response.data.test_customer_id;
          this.selectedCustomerId = this.userId;
          
          // Reload messages
          this.loadMessages();
          
          alert(`✅ Backend test data created!\n\nTest Customer ID: ${response.data.test_customer_id}\nTest Driver ID: ${response.data.test_driver_id}\nMessages: ${response.data.messages_created}`);
        }
      },
      error: (error) => {
        console.error('❌ Failed to create backend test data:', error);
        alert('❌ Failed to create test data. Check backend connection.');
      }
    });
  }

  simulateCustomerCall(): void {
    this.callStatus = {
      isActive: true,
      caller: 'user',
      recipient: 'driver',
      status: 'ringing'
    };
    
    alert('📞 Simulating incoming call from customer! You can now test answering.');
  }

  // Helper methods
  getMessageClass(message: Message): string {
    return this.isMessageSent(message) ? 'message-sent' : 'message-received';
  }

  isMessageSent(message: Message): boolean {
    return message.sender_id === this.currentDriverId || 
           (message.sender_type === 'driver' && this.currentDriverId > 0);
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
    
    return messageDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }

  toggleDebugInfo(): void {
    this.showDebugInfo = !this.showDebugInfo;
  }

  getConversationId(): string {
    if (!this.userId || !this.currentDriverId) return 'Not available';
    return `${Math.min(this.userId, this.currentDriverId)}-${Math.max(this.userId, this.currentDriverId)}`;
  }

  refreshConnection(): void {
    console.log('🔄 Refreshing connection...');
    this.connectionStatus = 'Reconnecting...';
    
    if (this.userId) {
      this.initializeMessaging();
    } else {
      this.loadAvailableCustomers();
    }
  }

  // Navigation helper
  goToCustomerSelection(): void {
    this.userId = 0;
    this.selectedCustomerId = 0;
    this.messages = [];
    this.loadAvailableCustomers();
    
    // Clear query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  // Helper method to get customer display name
  getCustomerDisplayName(): string {
    // Try to get customer name from available customers list
    const customer = this.availableCustomers.find(c => c.id === this.userId);
    if (customer && customer.name) {
      return customer.name;
    }
    
    // Try to get from the latest message if available
    if (this.messages.length > 0) {
      const customerMessage = this.messages.find(m => 
        m.sender_type === 'user' && m.sender
      );
      if (customerMessage && customerMessage.sender && customerMessage.sender.name) {
        return customerMessage.sender.name;
      }
    }
    
    // Fall back to Customer ID format
    return this.userId ? `Customer ${this.userId}` : 'Unknown Customer';
  }
}

// Export with alias for backward compatibility
export { DriverMessagingComponent as MessagingComponent };
