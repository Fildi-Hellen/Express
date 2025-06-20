import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';


@Injectable({
  providedIn: 'root'
})
export class EchoService {

public echo: Echo<any>;

  constructor() {
    (window as any).Pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: '69d11a194a2472138da8',          // Replace with your real key
      cluster: 'eu',         // Replace with 'mt1' or 'eu'
      forceTLS: true,
    });
  }

  listenToDriversChannel(callback: (data: any) => void): void {
    this.echo.channel('drivers')
      .listen('.new-ride-request', (data: any) => {
        console.log('📡 Ride request received:', data);
        callback(data);
      });
  }

  /**
   * Optionally: Stop listening when component is destroyed.
   */
  stopListening(): void {
    this.echo.leave('drivers');
  }

  listenToDriverCancellation(driverId: number, callback: (data: any) => void): void {
  this.echo.channel(`drivers.${driverId}`)
    .listen('.ride-cancelled', (data: any) => {
      console.log('🚫 Ride Cancelled by user:', data);
      callback(data);
    });
}



}
