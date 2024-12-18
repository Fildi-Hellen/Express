import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

 

  constructor() {}

  getDriverRatings(): Observable<any> {
    // Mock data: average rating and passenger feedback
    const data = {
      averageRating: 4.2,
      feedback: [
        { passenger: 'John Doe', rating: 5, comment: 'Excellent ride, very friendly driver!' },
        { passenger: 'Jane Smith', rating: 4, comment: 'Smooth trip, but a bit late.' },
        { passenger: 'Mike Johnson', rating: 3, comment: 'Okay, but could improve cleanliness.' }
      ]
    };
    return of(data);
  }

  submitDriverFeedback(content: string): Observable<any> {
    // In a real scenario, send content to the server
    return of({ success: true });
  }
}
