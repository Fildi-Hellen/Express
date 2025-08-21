import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
private base = environment.apiBase;
  constructor(private http: HttpClient) { }

  sendFeedback(feedbackData: { comment: string, rating: number, email: string }): Observable<any> {
    return this.http.post(this.base, feedbackData);
  }

}
