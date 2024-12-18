import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messageWebSocket: WebSocketSubject<any>;
  private callSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.messageWebSocket = new WebSocketSubject('ws://your-websocket-url/messages');
  }

  // Messaging
  sendMessage(message: { senderId: string, content: string, recipientId: string }): void {
    this.messageWebSocket.next(message);
  }

  getMessages(): Observable<any> {
    return this.messageWebSocket.asObservable();
  }

 // In chat.service.ts
  makeCall(callData: { from: string, to: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    // Simulate call setup
    setTimeout(() => {
      if (Math.random() > 0.5) { // Simulate a 50% chance of success or failure
        resolve();
      } else {
        reject(new Error("Failed to connect"));
      }
    }, 1000);
  });
}


  onCallStatus(): Observable<any> {
    return this.callSubject.asObservable();
  }

}
