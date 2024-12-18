import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportService {


  constructor() { }

  getHelpTopics(): Observable<any> {
    // Mock data for FAQs, troubleshooting guides, and videos
    const data = {
      faqs: [
        { question: 'How do I reset my password?', answer: 'Go to settings > account > reset password.' },
        { question: 'How do I update my payout details?', answer: 'In payout settings, choose your preferred method and update details.' }
      ],
      troubleshooting: [
        { title: 'App not loading', steps: ['Check your internet connection', 'Restart the app', 'Contact support if issue persists'] },
        { title: 'Location not updating', steps: ['Enable location services', 'Restart GPS', 'Check permissions in phone settings'] }
      ],
      videos: [
        { title: 'How to accept a trip', url: 'https://example.com/video1' },
        { title: 'Managing your earnings', url: 'https://example.com/video2' }
      ]
    };
    return of(data);
  }

  submitIssueReport(issue: any): Observable<any> {
    // In a real scenario, send the issue report to the server
    return of({ success: true });
  }

}
