import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsComponent } from '../Components/notifications/notifications.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private API_URL = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient,private dialog: MatDialog) {}

  getNotifications(): Observable<any> {
    return this.http.get(`${this.API_URL}/notifications`);
  }

  createNotification(message: string): Observable<any> {
    return this.http.post(`${this.API_URL}/notifications`, { message });
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.API_URL}/notifications/${id}/read`, {});
  }

  openNotifications(): void {
    this.dialog.open(NotificationsComponent, {
      width: '400px',
      data: {}
    });
  }
}
