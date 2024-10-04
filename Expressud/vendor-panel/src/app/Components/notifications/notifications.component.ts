import { Component } from '@angular/core';
import { NotificationService } from '../../Services/notification.service';
import { EchoService } from '../../Services/echo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

  notifications!: any[];
  audio: HTMLAudioElement | null = null;
  audioPlaying = false;

  constructor(private notificationService: NotificationService, private echoService: EchoService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getNotifications();
    this.listenForNewOrders();
  }

  listenForNewOrders(): void {
    this.echoService.listen('orders', 'OrderPlaced', (data: any) => {
      this.toastr.success('New order received!', 'Order Notification');
      if (!this.audioPlaying) {
        this.audio = new Audio('assets/sound.mp3');
        this.audio.play();
        this.audioPlaying = true;
      }
    });
  }

  getNotifications(): void {
    this.notificationService.getNotifications().subscribe(
      data => this.notifications = data,
      error => console.error('There was an error!', error)
    );
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe(
      () => {
        this.getNotifications();
        // Stop audio if it's playing
        if (this.audioPlaying && this.audio) {
          this.audio.pause();
          this.audioPlaying = false;
        }
      },
      error => console.error('There was an error!', error)
    );
  }

}
