import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

interface Message {
  id?: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  created_at?: string;
  sender_type: 'user' | 'driver';
}

interface CallData {
  caller_id: number;
  recipient_id: number;
  caller_type: 'user' | 'driver';
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private apiUrl = 'http://localhost:8000/api';
  private wsUrl = 'ws://localhost:8080';
  
  private socket$?: WebSocketSubject<any>;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private callStatusSubject = new BehaviorSubject<any>(null);
  private currentUserId = 0;
  private currentDriverId = 0;
  
  // Polling for real-time updates when WebSocket is not available
  private pollingInterval = 3000; // 3 seconds
  private isPolling = false;

  constructor(private http: HttpClient) {
    this.initializeCustomerService();
  }

  private initializeCustomerService(): void {
    console.log('👤 Initializing Customer MessagingService');
    
    // Get current user ID
    this.currentUserId = this.getCurrentUserId();
    console.log('👤 Customer ID set to:', this.currentUserId);
    
    // Try to initialize WebSocket, fallback to polling
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    try {
      this.socket$ = webSocket({
        url: `${this.wsUrl}/messaging`,
        openObserver: {
          next: () => {
            console.log('🔌 Customer WebSocket connected');
            this.authenticateWebSocket();
            this.isPolling = false;
          }
        },
        closeObserver: {
          next: () => {
            console.log('🔌 Customer WebSocket disconnected');
            this.startPolling();
          }
        }
      });

      this.socket$.subscribe({
        next: (message) => this.handleWebSocketMessage(message),
        error: (error) => {
          console.error('🔌 Customer WebSocket error:', error);
          this.startPolling();
        }
      });
    } catch (error) {
      console.error('🔌 Failed to initialize Customer WebSocket:', error);
      this.startPolling();
    }
  }

  private authenticateWebSocket(): void {
    const token = localStorage.getItem('authToken') || localStorage.getItem('user_token');
    if (token && this.socket$) {
      this.socket$.next({
        type: 'auth',
        token: token,
        user_type: 'user',
        user_id: this.currentUserId
      });
    }
  }

  private handleWebSocketMessage(message: any): void {
    switch (message.type) {
      case 'new_message':
        this.handleNewMessage(message.data);
        break;
      case 'call_status':
        this.callStatusSubject.next(message.data);
        break;
      case 'incoming_call':
        this.callStatusSubject.next({
          isActive: true,
          caller: 'driver',
          recipient: 'user',
          status: 'ringing',
          caller_info: message.data.caller_info
        });
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private handleNewMessage(message: Message): void {
    const currentMessages = this.messagesSubject.value;
    // Avoid duplicates
    if (!currentMessages.find(m => m.id === message.id)) {
      this.messagesSubject.next([...currentMessages, message]);
    }
  }

  private startPolling(): void {
    if (this.isPolling || !this.currentDriverId) return;
    
    this.isPolling = true;
    console.log('🔄 Starting polling for customer messages');
    
    interval(this.pollingInterval).pipe(
      switchMap(() => {
        if (!this.currentDriverId) return of(null);
        return this.getConversationFromAPI(this.currentDriverId).pipe(
          catchError(error => {
            console.error('Polling error:', error);
            return of(null);
          })
        );
      })
    ).subscribe(response => {
      if (response && response.success) {
        this.messagesSubject.next(response.data);
      }
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || localStorage.getItem('user_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Set current driver for this conversation
  setCurrentDriver(driverId: number): void {
    console.log('🚗 Setting current driver:', driverId);
    this.currentDriverId = driverId;
    localStorage.setItem('currentDriverId', driverId.toString());
    
    // Start polling if WebSocket is not connected
    if (!this.socket$ || this.socket$.closed) {
      this.startPolling();
    }
  }

  getCurrentUserId(): number {
    let userId = parseInt(localStorage.getItem('userId') || '0');
    
    // If no user ID, set a default for testing
    if (!userId || userId === 0) {
      userId = 2; // Default customer ID
      localStorage.setItem('userId', userId.toString());
      console.log('🔧 Set default customer ID to:', userId);
    }
    
    return userId;
  }

  sendMessage(message: Message): Observable<Message> {
    console.log('👤💬 Customer sending message:', message);
    
    const messageData: Omit<Message, 'id' | 'created_at'> = {
      sender_id: message.sender_id || this.currentUserId,
      recipient_id: message.recipient_id,
      content: message.content,
      sender_type: 'user'
    };

    const headers = this.getHeaders();
    const httpRequest = this.http.post<any>(`${this.apiUrl}/messages`, messageData, { headers });
    
    // Also send via WebSocket for real-time delivery
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next({
        type: 'message',
        data: messageData
      });
    }

    // Update local messages immediately for better UX
    const tempMessage: Message = {
      ...messageData,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    this.handleNewMessage(tempMessage);
    
    return httpRequest.pipe(
      map(response => {
        if (response.success) {
          // Replace temp message with server response
          const messages = this.messagesSubject.value;
          const tempIndex = messages.findIndex(m => m.id === tempMessage.id);
          if (tempIndex !== -1) {
            messages[tempIndex] = response.data;
            this.messagesSubject.next([...messages]);
          }
          return response.data;
        }
        return tempMessage;
      }),
      catchError(error => {
        console.error('❌ Failed to send message via API:', error);
        return of(tempMessage); // Return temp message so UI doesn't break
      })
    );
  }

  getConversation(driverId: number): Observable<Message[]> {
    console.log('👤📥 Customer getting conversation with driver:', driverId);
    this.setCurrentDriver(driverId);
    
    // Try API first
    return this.getConversationFromAPI(driverId).pipe(
      map(response => {
        if (response.success) {
          this.messagesSubject.next(response.data);
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        console.error('⚠️ API unavailable for conversation:', error);
        return of(this.messagesSubject.value);
      })
    );
  }

  private getConversationFromAPI(driverId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/conversations/${driverId}`, { headers });
  }

  // Subscribe to live conversation updates
  subscribeToConversation(driverId: number): Observable<Message[]> {
    console.log('🔔 Customer subscribing to conversation with driver:', driverId);
    this.setCurrentDriver(driverId);
    
    // Load initial messages
    this.getConversation(driverId).subscribe();
    
    // Return the message subject for live updates
    return this.messagesSubject.asObservable();
  }

  onNewMessage(): Observable<Message> {
    return new Observable(observer => {
      this.messagesSubject.subscribe(messages => {
        if (messages.length > 0) {
          observer.next(messages[messages.length - 1]);
        }
      });
    });
  }

  makeCall(driverId: number): Observable<any> {
    const headers = this.getHeaders();
    const callData: CallData = {
      caller_id: this.currentUserId,
      recipient_id: driverId,
      caller_type: 'user'
    };

    const httpRequest = this.http.post(`${this.apiUrl}/calls/make`, callData, { headers });
    
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next({
        type: 'make_call',
        data: callData
      });
    }
    
    return httpRequest;
  }

  answerCall(): Observable<any> {
    const headers = this.getHeaders();
    const answerData = {
      user_id: this.currentUserId,
      action: 'answer'
    };

    const httpRequest = this.http.post(`${this.apiUrl}/calls/answer`, answerData, { headers });
    
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next({
        type: 'answer_call',
        data: answerData
      });
    }
    
    return httpRequest;
  }

  endCall(): Observable<any> {
    const headers = this.getHeaders();
    const endData = {
      user_id: this.currentUserId,
      action: 'end'
    };

    const httpRequest = this.http.post(`${this.apiUrl}/calls/end`, endData, { headers });
    
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.next({
        type: 'end_call',
        data: endData
      });
    }
    
    return httpRequest;
  }

  onCallStatus(): Observable<any> {
    return this.callStatusSubject.asObservable();
  }

  // Test and utility methods
  createTestData(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/messaging/test-data`, {}, { headers });
  }

  getAllConversations(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/messaging/conversations`, { headers });
  }

  clearAllMessages(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/messaging/clear`, { headers });
  }

  // Legacy methods for compatibility
  loadTestConversation(driverId: number): void {
    console.log('🧪 Customer loading test conversation with driver:', driverId);
    this.createTestData().subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Test data created:', response.data);
          // Reload conversation
          this.getConversation(driverId).subscribe();
        }
      },
      error: (error) => {
        console.error('❌ Failed to create test data:', error);
      }
    });
  }

  clearAllConversations(): void {
    console.log('🗑️ Customer clearing all conversations');
    this.clearAllMessages().subscribe({
      next: (response) => {
        if (response.success) {
          this.messagesSubject.next([]);
          console.log('✅ All messages cleared');
        }
      },
      error: (error) => {
        console.error('❌ Failed to clear messages:', error);
      }
    });
  }

  getConversationSummary(): any {
    return {
      user_id: this.currentUserId,
      driver_id: this.currentDriverId,
      message_count: this.messagesSubject.value.length,
      last_updated: new Date().toISOString()
    };
  }

  disconnect(): void {
    this.isPolling = false;
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
