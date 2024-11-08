import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class EchoService {

  private echo: Echo;

  constructor() {
    // Ensure Pusher is available globally
    (window as any).Pusher = Pusher;

    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'd5f8bb8dc391844fce5e',  // Replace with your Pusher key
      cluster: 'eu',  // Replace with your Pusher cluster
      forceTLS: true,
    });
  }

  listen(channel: string, event: string, callback: Function) {
    this.echo.channel(channel).listen(event, (data: any) => {
      callback(data);
    });
  }
}
