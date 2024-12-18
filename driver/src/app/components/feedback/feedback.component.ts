import { Component, OnInit } from '@angular/core';
import { RatingService } from '../../Services/rating.service';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css'],
    standalone: false
})
export class FeedbackComponent implements OnInit {
    averageRating: number = 0;
  feedbackList: any[] = [];
  driverFeedback: string = '';

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.ratingService.getDriverRatings().subscribe(data => {
      this.averageRating = data.averageRating;
      this.feedbackList = data.feedback;
    });
  }

  submitFeedback(): void {
    if (this.driverFeedback.trim().length > 0) {
      this.ratingService.submitDriverFeedback(this.driverFeedback).subscribe(response => {
        if (response.success) {
          alert('Feedback submitted successfully!');
          this.driverFeedback = '';
        }
      });
    } else {
      alert('Please enter your feedback before submitting.');
    }
  }

}
