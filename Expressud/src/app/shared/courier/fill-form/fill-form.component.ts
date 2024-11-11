import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-fill-form',
  templateUrl: './fill-form.component.html',
  styleUrl: './fill-form.component.css'
})
export class FillFormComponent {
  fullName: string = '';
  email: string = '';
  phone: string = '';
  showSuccessMessage: boolean = false;
  
  @ViewChild('form') form!: NgForm;

  submitForm(): void {
    if (!this.fullName || !this.email || !this.phone) {
      return; // Don't submit the form if any required field is empty
    }
    
    // Perform form submission logic here (e.g., sending data to a server)

    // Display success message
    this.showSuccessMessage = true;

    // Clear input fields
    this.fullName = '';
    this.email = '';
    this.phone = '';
    
    // Reset form validation state
    this.resetForm();
  }

  resetForm(): void {
    // Reset form submission status and validation state
    this.showSuccessMessage = false;
    if (this.form) {
      this.form.resetForm();
    }
  }
}

