import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../Services/contact.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent  implements OnInit{

  contactForm!: FormGroup;
  messageReceived: boolean = false;

  constructor(private formBuilder: FormBuilder, private contactService: ContactService) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  submitForm() {
    if (this.contactForm.valid) {
      this.contactService.sendFormData(this.contactForm.value).subscribe(
        (response: any) => {
          console.log('Form data sent successfully:', response);
          this.messageReceived = true;
          this.contactForm.reset();
        },
        (error: any) => {
          console.error('Error sending form data:', error);
        }
      );
    } else {
      Object.keys(this.contactForm.controls).forEach(field => {
        const control = this.contactForm.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

}
