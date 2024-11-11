import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FeedbackService } from 'src/app/Services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'] // Corrected property name and provided CSS file path
})
export class FeedbackComponent implements OnInit {

  feedbackForm!: FormGroup;
  currentRating: number = 0;

  constructor(private formBuilder: FormBuilder, private feedbackService: FeedbackService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.feedbackForm = this.formBuilder.group({
      comment: ['', Validators.required],
      rating: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  setRating(rating: number): void {
    this.currentRating = rating;
    this.feedbackForm?.get('rating')?.setValue(rating);
  }

  onSubmit(): void {
    if (this.feedbackForm.valid) {
      this.feedbackService.sendFeedback(this.feedbackForm.value)
        .subscribe(
          response => {
            console.log('Feedback sent successfully', response);
            this.feedbackForm.reset(); // Reset the form fields
            this.currentRating = 0;
          },
          error => {
            console.error('Error sending feedback', error);
          }
        );
    }
  }
}
