import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private apiUrl = 'http://127.0.0.1:8000/api/settings';

  constructor(private http: HttpClient) {}

  getSettings(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateSettings(settings: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, settings);
  }
}
