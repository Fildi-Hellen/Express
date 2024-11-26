import { Component } from '@angular/core';
import { MenuService } from '../../Services/menu.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {


  menuForm!: FormGroup;
  establishmentType!: string;
  message!: string;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Fetch the vendor's establishment type from the backend
    this.menuService.getVendorProfile().subscribe(
      (vendor: any) => {
        this.establishmentType = vendor.establishmentType;
        this.initializeForm();
      },
      (error) => {
        this.message = 'Error fetching vendor profile.';
      }
    );
  }

  initializeForm() {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [''],
      category: [''],
      image: [null],
      // Additional fields
      location: [''],
      size: [''],
      expirationDate: ['']
    });

    // Adjust validators based on establishment type
    if (this.establishmentType === 'realEstate') {
      this.menuForm.get('location')?.setValidators([Validators.required]);
    } else if (this.establishmentType === 'pharmacy') {
      this.menuForm.get('expirationDate')?.setValidators([Validators.required]);
    }
    // Add conditions for other types as needed
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.menuForm.patchValue({
        image: event.target.files[0]
      });
    }
  }

  onSubmit() {
    if (this.menuForm.invalid) {
      return;
    }

    // Prepare form data
    const formData = new FormData();
    Object.keys(this.menuForm.controls).forEach((key) => {
      const control = this.menuForm.get(key);
      if (control && control.value) {
        formData.append(key, control.value);
      }
    });

    this.menuService.addMenuItem(formData).subscribe(
      (response: any) => {
        this.message = 'Item added successfully.';
        this.menuForm.reset();
      },
      (error) => {
        this.message = 'There was an error adding the item.';
      }
    );
  }

}
