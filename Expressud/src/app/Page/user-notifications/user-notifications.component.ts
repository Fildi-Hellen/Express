import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrl: './user-notifications.component.css'
})
export class UserNotificationsComponent implements OnInit{
  notifications: any[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.getUserNotifications().subscribe(data => {
      this.notifications = data;
    });
  }

}
