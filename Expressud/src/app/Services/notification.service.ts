import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  getUserNotifications(): Observable<any> {
    return this.http.get(`${this.base}/user/notifications`);
  }
}
