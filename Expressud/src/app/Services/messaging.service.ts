import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
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
  private apiUrl = 'http://127.0.0.1:8000/api'; // Default fallback
  private wsUrl = 'ws://localhost:8080'; // Default fallback
  
  private socket$?: WebSocketSubject<any>;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private callStatusSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.initializeWebSocket();
  }

  private initializeWebSocket(): void {
    try {
      this.socket$ = webSocket({
        url: `${this.wsUrl}/messaging`,
        openObserver: {
          next: () => {
            console.log('WebSocket connection opened');
            this.authenticateWebSocket();
          }
        },
        closeObserver: {
          next: () => {
            console.log('WebSocket connection closed');
            // Implement reconnection logic here
            setTimeout(() => this.initializeWebSocket(), 5000);
          }
        }
      });

      this.socket$.subscribe({
        next: (message) => this.handleWebSocketMessage(message),
        error: (error) => {
          console.error('WebSocket error:', error);
          // Fallback to HTTP polling if WebSocket fails
          this.startHttpPolling();
        }
      });
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.startHttpPolling();
    }
  }

  private authenticateWebSocket(): void {
    const token = localStorage.getItem('authToken');
    if (token && this.socket$) {
      this.socket$.next({
        type: 'auth',
        token: token
      });
    }
  }

  private handleWebSocketMessage(message: any): void {
    switch (message.type) {
      case 'new_message':
        this.messagesSubject.next([...this.messagesSubject.value, message.data]);
        break;
      case 'call_status':
        this.callStatusSubject.next(message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private startHttpPolling(): void {
    // Implement HTTP polling as fallback for real-time features
    console.log('Starting HTTP polling for messages');
    // This would be implemented based on your specific needs
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Send a message
  sendMessage(message: Message): Observable<Message> {
    const headers = this.getHeaders();
    
    // Send via HTTP first for persistence
    const httpRequest = this.http.post<Message>(`${this.apiUrl}/messages`, message, { headers });
    
    // Also send via WebSocket for real-time delivery
    if (this.socket$) {
      this.socket$.next({
        type: 'send_message',
        data: message
      });
    }
    
    return httpRequest;
  }

  // Get conversation with a specific user/driver
  getConversation(participantId: number): Observable<Message[]> {
    const headers = this.getHeaders();
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${participantId}`, { headers });
  }

  // Subscribe to new messages
  onNewMessage(): Observable<Message> {
    return new Observable(observer => {
      this.messagesSubject.subscribe(messages => {
        if (messages.length > 0) {
          observer.next(messages[messages.length - 1]);
        }
      });
    });
  }

  // Make a call
  makeCall(recipientId: number): Observable<any> {
    const headers = this.getHeaders();
    const callData: CallData = {
      caller_id: this.getCurrentUserId(),
      recipient_id: recipientId,
      caller_type: 'user'
    };

    // Send call request via HTTP
    const httpRequest = this.http.post(`${this.apiUrl}/calls/make`, callData, { headers });
    
    // Also send via WebSocket for real-time notification
    if (this.socket$) {
      this.socket$.next({
        type: 'make_call',
        data: callData
      });
    }
    
    return httpRequest;
  }

  // Answer a call
  answerCall(): Observable<any> {
    const headers = this.getHeaders();
    const answerData = {
      user_id: this.getCurrentUserId(),
      action: 'answer'
    };

    // Send via HTTP
    const httpRequest = this.http.post(`${this.apiUrl}/calls/answer`, answerData, { headers });
    
    // Also send via WebSocket
    if (this.socket$) {
      this.socket$.next({
        type: 'answer_call',
        data: answerData
      });
    }
    
    return httpRequest;
  }

  // End a call
  endCall(): Observable<any> {
    const headers = this.getHeaders();
    const endData = {
      user_id: this.getCurrentUserId(),
      action: 'end'
    };

    // Send via HTTP
    const httpRequest = this.http.post(`${this.apiUrl}/calls/end`, endData, { headers });
    
    // Also send via WebSocket
    if (this.socket$) {
      this.socket$.next({
        type: 'end_call',
        data: endData
      });
    }
    
    return httpRequest;
  }

  // Subscribe to call status updates
  onCallStatus(): Observable<any> {
    return this.callStatusSubject.asObservable();
  }

  // Get current user ID from storage
  private getCurrentUserId(): number {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : 0;
  }

  // Clean up WebSocket connection
  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
