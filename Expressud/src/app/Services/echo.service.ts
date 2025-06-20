import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
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

  // Example method to listen to a channel
 listen(channel: string, event: string, cb: (data: any) => void) {
    return this.echo.channel(channel).listen(event, cb);
  }
}
