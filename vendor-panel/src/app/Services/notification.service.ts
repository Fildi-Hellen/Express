import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsComponent } from '../Components/notifications/notifications.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

private base = environment.apiBase;

  constructor(private http: HttpClient,private dialog: MatDialog) {}

  getNotifications(): Observable<any> {
    return this.http.get(`${this.base}/notifications`);
  }

  createNotification(message: string): Observable<any> {
    return this.http.post(`${this.base}/notifications`, { message });
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.base}/notifications/${id}/read`, {});
  }

  openNotifications(): void {
    this.dialog.open(NotificationsComponent, {
      width: '400px',
      data: {}
    });
  }
}
