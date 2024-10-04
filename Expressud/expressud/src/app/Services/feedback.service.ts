import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://127.0.0.1:8000/api/send-feedback';

  constructor(private http: HttpClient) { }

  sendFeedback(feedbackData: { comment: string, rating: number, email: string }): Observable<any> {
    return this.http.post(this.apiUrl, feedbackData);
  }

}
