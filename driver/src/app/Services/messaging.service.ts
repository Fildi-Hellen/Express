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
  private apiUrl = 'http://localhost:8000/api';
  private wsUrl = 'ws://localhost:8080';
  
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
            console.log('Driver WebSocket connection opened');
            this.authenticateWebSocket();
          }
        },
        closeObserver: {
          next: () => {
            console.log('Driver WebSocket connection closed');
            setTimeout(() => this.initializeWebSocket(), 5000);
          }
        }
      });

      this.socket$.subscribe({
        next: (message) => this.handleWebSocketMessage(message),
        error: (error) => {
          console.error('Driver WebSocket error:', error);
          this.startHttpPolling();
        }
      });
    } catch (error) {
      console.error('Failed to initialize Driver WebSocket:', error);
      this.startHttpPolling();
    }
  }

  private authenticateWebSocket(): void {
    const token = localStorage.getItem('authToken');
    const driverId = localStorage.getItem('driverId');
    if (token && this.socket$) {
      this.socket$.next({
        type: 'auth',
        token: token,
        user_type: 'driver',
        user_id: driverId
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

  private startHttpPolling(): void {
    console.log('Starting HTTP polling for driver messages');
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  sendMessage(message: Message): Observable<Message> {
    const headers = this.getHeaders();
    const httpRequest = this.http.post<Message>(`${this.apiUrl}/messages`, message, { headers });
    
    if (this.socket$) {
      this.socket$.next({
        type: 'send_message',
        data: message
      });
    }
    
    return httpRequest;
  }

  getConversation(userId: number): Observable<Message[]> {
    const headers = this.getHeaders();
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${userId}`, { headers });
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

  makeCall(userId: number): Observable<any> {
    const headers = this.getHeaders();
    const callData: CallData = {
      caller_id: this.getCurrentDriverId(),
      recipient_id: userId,
      caller_type: 'driver'
    };

    const httpRequest = this.http.post(`${this.apiUrl}/calls/make`, callData, { headers });
    
    if (this.socket$) {
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
      driver_id: this.getCurrentDriverId(),
      action: 'answer'
    };

    const httpRequest = this.http.post(`${this.apiUrl}/calls/answer`, answerData, { headers });
    
    if (this.socket$) {
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
      driver_id: this.getCurrentDriverId(),
      action: 'end'
    };

    const httpRequest = this.http.post(`${this.apiUrl}/calls/end`, endData, { headers });
    
    if (this.socket$) {
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

  private getCurrentDriverId(): number {
    const driverId = localStorage.getItem('driverId');
    return driverId ? parseInt(driverId, 10) : 0;
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
