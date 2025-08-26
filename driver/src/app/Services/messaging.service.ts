import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment.prod';

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
private base = environment.apiBase;
  private wsUrl = 'ws://localhost:8080';
  

  private socket$?: WebSocketSubject<any>;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private callStatusSubject = new BehaviorSubject<any>(null);
  private currentDriverId = 0;
  private currentCustomerId = 0;
  
  // Polling for real-time updates when WebSocket is not available
  private pollingInterval = 3000; // 3 seconds
  private isPolling = false;

  constructor(private http: HttpClient) {
    this.initializeDriverService();
  }

  private initializeDriverService(): void {
    console.log('🚗 Initializing Driver MessagingService');
    
    // Get current driver info
    this.getCurrentUserInfo().subscribe({
      next: (response) => {
        if (response.success && response.data.driver_id) {
          this.currentDriverId = response.data.driver_id;
          localStorage.setItem('driverId', this.currentDriverId.toString());
          localStorage.setItem('isDriver', 'true');
          console.log('✅ Driver ID set:', this.currentDriverId);
        } else {
          // Fallback for testing
          this.currentDriverId = parseInt(localStorage.getItem('driverId') || '1');
          console.log('🔧 Using fallback driver ID:', this.currentDriverId);
        }
      },
      error: (error) => {
        console.error('❌ Failed to get driver info:', error);
        this.currentDriverId = parseInt(localStorage.getItem('driverId') || '1');
        console.log('🔧 Using local storage driver ID:', this.currentDriverId);
      }
    });

    // Try to initialize WebSocket, fallback to polling
    this.initializeWebSocket();
  }

  private getCurrentUserInfo(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.base}/user/current`, { headers });
  }

  private initializeWebSocket(): void {
    try {
      this.socket$ = webSocket({
        url: `${this.wsUrl}/messaging`,
        openObserver: {
          next: () => {
            console.log('🔌 Driver WebSocket connected');
            this.authenticateWebSocket();
            this.isPolling = false;
          }
        },
        closeObserver: {
          next: () => {
            console.log('🔌 Driver WebSocket disconnected');
            this.startPolling();
          }
        }
      });

      this.socket$.subscribe({
        next: (message) => this.handleWebSocketMessage(message),
        error: (error) => {
          console.error('🔌 Driver WebSocket error:', error);
          this.startPolling();
        }
      });
    } catch (error) {
      console.error('🔌 Failed to initialize Driver WebSocket:', error);
      this.startPolling();
    }
  }

  private authenticateWebSocket(): void {
    const token = localStorage.getItem('authToken');
    if (token && this.socket$) {
      this.socket$.next({
        type: 'auth',
        token: token,
        user_type: 'driver',
        user_id: this.currentDriverId
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
          caller: 'user',
          recipient: 'driver',
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
    if (this.isPolling || !this.currentCustomerId) return;
    
    this.isPolling = true;
    console.log('🔄 Starting polling for driver messages');
    
    interval(this.pollingInterval).pipe(
      switchMap(() => {
        if (!this.currentCustomerId) return of(null);
        return this.getConversationFromAPI(this.currentCustomerId).pipe(
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
    const token = localStorage.getItem('authToken') || localStorage.getItem('driver_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  // Set current customer for this conversation
  setCurrentCustomer(customerId: number): void {
    console.log('👤 Setting current customer:', customerId);
    this.currentCustomerId = customerId;
    localStorage.setItem('currentCustomerId', customerId.toString());
    
    // Start polling if WebSocket is not connected
    if (!this.socket$ || this.socket$.closed) {
      this.startPolling();
    }
  }

  sendMessage(message: Message): Observable<Message> {
    console.log('🚗💬 Driver sending message:', message);
    
    const messageData: Omit<Message, 'id' | 'created_at'> = {
      sender_id: message.sender_id || this.currentDriverId,
      recipient_id: message.recipient_id,
      content: message.content,
      sender_type: 'driver'
    };

    const headers = this.getHeaders();
    const httpRequest = this.http.post<any>(`${this.base}/messages`, messageData, { headers });
    
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

  getConversation(customerId: number): Observable<Message[]> {
    console.log('🚗📥 Driver getting conversation with customer:', customerId);
    this.setCurrentCustomer(customerId);
    
    // Try API first
    return this.getConversationFromAPI(customerId).pipe(
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

  private getConversationFromAPI(customerId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.base}/driver/conversations/${customerId}`, { headers });
  }

  // Subscribe to live conversation updates
  subscribeToConversation(customerId: number): Observable<Message[]> {
    console.log('🔔 Driver subscribing to conversation with customer:', customerId);
    this.setCurrentCustomer(customerId);
    
    // Load initial messages
    this.getConversation(customerId).subscribe();
    
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

  makeCall(customerId: number): Observable<any> {
    const headers = this.getHeaders();
    const callData: CallData = {
      caller_id: this.currentDriverId,
      recipient_id: customerId,
      caller_type: 'driver'
    };

    const httpRequest = this.http.post(`${this.base}/calls/make`, callData, { headers });
    
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
      driver_id: this.currentDriverId,
      action: 'answer'
    };

    const httpRequest = this.http.post(`${this.base}/calls/answer`, answerData, { headers });
    
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
      driver_id: this.currentDriverId,
      action: 'end'
    };

    const httpRequest = this.http.post(`${this.base}/calls/end`, endData, { headers });
    
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

  getCurrentDriverId(): number {
    if (this.currentDriverId === 0) {
      this.currentDriverId = parseInt(localStorage.getItem('driverId') || '1');
    }
    return this.currentDriverId;
  }

  // Test and utility methods
  createTestData(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.base}/messaging/test-data`, {}, { headers });
  }

  getAllConversations(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.base}/messaging/conversations`, { headers });
  }

  clearAllMessages(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.base}/messaging/clear`, { headers });
  }

  // Legacy methods for compatibility
  loadTestConversation(customerId: number): void {
    console.log('🧪 Driver loading test conversation with customer:', customerId);
    this.createTestData().subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Test data created:', response.data);
          // Reload conversation
          this.getConversation(customerId).subscribe();
        }
      },
      error: (error) => {
        console.error('❌ Failed to create test data:', error);
      }
    });
  }

  clearAllConversations(): void {
    console.log('🗑️ Driver clearing all conversations');
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
      driver_id: this.currentDriverId,
      customer_id: this.currentCustomerId,
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
