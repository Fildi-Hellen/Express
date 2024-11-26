import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VendorService } from 'src/app/Services/vendor.service';



@Component({
  selector: 'app-popform',
  templateUrl: './popform.component.html',
  styleUrl: './popform.component.css'
})
export class PopformComponent implements OnInit {

  registerForm!: FormGroup;
  message!: string;

  constructor(private vendorService: VendorService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      establishmentName: ['', [Validators.required]],
      establishmentType: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      numberOfStores: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      location: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
      promocode: [false],
      acceptUpdates: [false],
      acceptPrivacyPolicy: [false, Validators.requiredTrue]

    });
  }



  register() {
      if (this.registerForm.valid) {
        console.log('Form Data:', this.registerForm.value);
      this.vendorService.registerVendor(this.registerForm.value).subscribe(
        (response: any) => {
          this.message = response.message;
          this.message = response.message;
        this.registerForm.reset(); // Clear the form fields
        setTimeout(() => {
          this.message = ''; // Clear the message after a delay
        }, 5000);
       


        },
        (error) => {
           console.error('Registration Error:', error); 
          if (error.error && error.error.errors) {
            this.message = Object.values(error.error.errors).join(' ');
          } else {
            this.message = 'There was an error during registration.';
          }
        }
      );
    }
  }
}

