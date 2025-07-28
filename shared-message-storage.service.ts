import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Message {
  id: string;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at: string;
  sender_type: 'user' | 'driver';
  conversation_id: string; // Key for grouping messages
}

interface Conversation {
  customer_id: number;
  driver_id: number;
  messages: Message[];
  last_updated: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedMessageStorageService {
  private readonly STORAGE_KEY = 'express_chat_conversations';
  private conversations: Map<string, Conversation> = new Map();
  private messageSubjects: Map<string, BehaviorSubject<Message[]>> = new Map();

  constructor() {
    this.loadFromStorage();
    console.log('📱 SharedMessageStorageService initialized');
    console.log('💾 Loaded conversations:', this.conversations.size);
  }

  // Generate conversation ID for customer-driver pair
  private getConversationId(customerId: number, driverId: number): string {
    return `${Math.min(customerId, driverId)}-${Math.max(customerId, driverId)}`;
  }

  // Load conversations from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        Object.keys(data).forEach(key => {
          this.conversations.set(key, data[key]);
          // Initialize message subject for each conversation
          this.messageSubjects.set(key, new BehaviorSubject<Message[]>(data[key].messages || []));
        });
        console.log('✅ Loaded conversations from storage:', Object.keys(data));
      }
    } catch (error) {
      console.error('❌ Error loading conversations from storage:', error);
    }
  }

  // Save conversations to localStorage
  private saveToStorage(): void {
    try {
      const data: any = {};
      this.conversations.forEach((conversation, key) => {
        data[key] = conversation;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log('💾 Saved conversations to storage');
    } catch (error) {
      console.error('❌ Error saving conversations to storage:', error);
    }
  }

  // Send a message
  sendMessage(message: Omit<Message, 'id' | 'created_at' | 'conversation_id'>): Observable<Message> {
    return new Observable(observer => {
      const conversationId = this.getConversationId(
        message.sender_type === 'user' ? message.sender_id : message.recipient_id,
        message.sender_type === 'driver' ? message.sender_id : message.recipient_id
      );

      const fullMessage: Message = {
        ...message,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        conversation_id: conversationId
      };

      console.log('📤 Sending message:', fullMessage);
      console.log('🆔 Conversation ID:', conversationId);

      // Get or create conversation
      let conversation = this.conversations.get(conversationId);
      if (!conversation) {
        conversation = {
          customer_id: message.sender_type === 'user' ? message.sender_id : message.recipient_id,
          driver_id: message.sender_type === 'driver' ? message.sender_id : message.recipient_id,
          messages: [],
          last_updated: new Date().toISOString()
        };
        this.conversations.set(conversationId, conversation);
        this.messageSubjects.set(conversationId, new BehaviorSubject<Message[]>([]));
      }

      // Add message to conversation
      conversation.messages.push(fullMessage);
      conversation.last_updated = new Date().toISOString();

      // Update the message subject to notify subscribers
      const messageSubject = this.messageSubjects.get(conversationId);
      if (messageSubject) {
        messageSubject.next([...conversation.messages]);
      }

      // Save to storage
      this.saveToStorage();

      console.log('✅ Message added to conversation. Total messages:', conversation.messages.length);

      // Simulate network delay and return the message
      setTimeout(() => {
        observer.next(fullMessage);
        observer.complete();
      }, 100);
    });
  }

  // Get conversation messages
  getConversationMessages(customerId: number, driverId: number): Observable<Message[]> {
    const conversationId = this.getConversationId(customerId, driverId);
    console.log('📥 Getting conversation messages for:', conversationId);
    
    let conversation = this.conversations.get(conversationId);
    if (!conversation) {
      // Create new conversation if it doesn't exist
      conversation = {
        customer_id: customerId,
        driver_id: driverId,
        messages: [],
        last_updated: new Date().toISOString()
      };
      this.conversations.set(conversationId, conversation);
      this.messageSubjects.set(conversationId, new BehaviorSubject<Message[]>([]));
      this.saveToStorage();
    }

    // Get or create message subject for this conversation
    let messageSubject = this.messageSubjects.get(conversationId);
    if (!messageSubject) {
      messageSubject = new BehaviorSubject<Message[]>(conversation.messages);
      this.messageSubjects.set(conversationId, messageSubject);
    }

    console.log('📋 Returning', conversation.messages.length, 'messages for conversation:', conversationId);
    return messageSubject.asObservable();
  }

  // Subscribe to new messages in a conversation
  onNewMessage(customerId: number, driverId: number): Observable<Message[]> {
    return this.getConversationMessages(customerId, driverId);
  }

  // Clear all conversations (for testing)
  clearAllConversations(): void {
    console.log('🗑️ Clearing all conversations');
    this.conversations.clear();
    this.messageSubjects.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('✅ All conversations cleared');
  }

  // Get conversation summary for debugging
  getConversationSummary(): any {
    const summary: any = {};
    this.conversations.forEach((conversation, id) => {
      summary[id] = {
        customer_id: conversation.customer_id,
        driver_id: conversation.driver_id,
        message_count: conversation.messages.length,
        last_updated: conversation.last_updated,
        last_message: conversation.messages[conversation.messages.length - 1]?.content || 'No messages'
      };
    });
    return summary;
  }

  // Load test data
  loadTestConversation(customerId: number, driverId: number): void {
    const conversationId = this.getConversationId(customerId, driverId);
    console.log('🧪 Loading test conversation for:', conversationId);

    const testMessages: Message[] = [
      {
        id: 'test-1',
        sender_id: customerId,
        recipient_id: driverId,
        content: "Hello! I'm ready for pickup.",
        created_at: new Date(Date.now() - 300000).toISOString(),
        sender_type: 'user',
        conversation_id: conversationId
      },
      {
        id: 'test-2',
        sender_id: driverId,
        recipient_id: customerId,
        content: "Hi! I'm on my way, arriving in 5 minutes.",
        created_at: new Date(Date.now() - 240000).toISOString(),
        sender_type: 'driver',
        conversation_id: conversationId
      },
      {
        id: 'test-3',
        sender_id: customerId,
        recipient_id: driverId,
        content: "Perfect! I'm wearing a red jacket.",
        created_at: new Date(Date.now() - 120000).toISOString(),
        sender_type: 'user',
        conversation_id: conversationId
      },
      {
        id: 'test-4',
        sender_id: driverId,
        recipient_id: customerId,
        content: "Great! I can see you. Blue Honda Civic.",
        created_at: new Date(Date.now() - 60000).toISOString(),
        sender_type: 'driver',
        conversation_id: conversationId
      }
    ];

    const conversation: Conversation = {
      customer_id: customerId,
      driver_id: driverId,
      messages: testMessages,
      last_updated: new Date().toISOString()
    };

    this.conversations.set(conversationId, conversation);
    
    // Update or create message subject
    let messageSubject = this.messageSubjects.get(conversationId);
    if (!messageSubject) {
      messageSubject = new BehaviorSubject<Message[]>(testMessages);
      this.messageSubjects.set(conversationId, messageSubject);
    } else {
      messageSubject.next(testMessages);
    }

    this.saveToStorage();
    console.log('✅ Test conversation loaded with', testMessages.length, 'messages');
  }
}
