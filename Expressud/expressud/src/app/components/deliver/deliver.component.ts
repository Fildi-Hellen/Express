import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DriverService } from 'src/app/Services/driver.service';

@Component({
  selector: 'app-deliver',
  templateUrl: './deliver.component.html',
  styleUrl: './deliver.component.css'
})
export class DeliverComponent {
  driverForm!: FormGroup;
  additionalForm!: FormGroup;
  message!: string;

  @ViewChild('detailsModal') detailsModal: any;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private driverService: DriverService
  ) { }

  ngOnInit(): void {
    this.driverForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      city: ['', Validators.required],
      vehicle:['',Validators.required]
    });

    this.additionalForm = this.fb.group({
      driverPermitNo: ['', Validators.required],
      numberPlate: ['', Validators.required],
      hasHelmet: [false]
    });
  }

  openDetailsModal(content: any, vehicleType: string) {
    if (vehicleType === 'MOTORBIKE') {
      this.additionalForm.get('hasHelmet')?.setValidators(Validators.requiredTrue);
    } else {
      this.additionalForm.get('hasHelmet')?.clearValidators();
    }
    this.additionalForm.get('hasHelmet')?.updateValueAndValidity();
    this.modalService.open(content);
  }

  closeModal(modal: any) {
    modal.dismiss('Cross click');
  }

  saveDetails() {
    if (this.additionalForm.valid) {
      this.modalService.dismissAll();
    }
  }

  onSubmit() {
    if (this.driverForm.valid && this.additionalForm.valid) {
      const driverData = {
        ...this.driverForm.value,
        ...this.additionalForm.value,
        role: 'driver'
      };
      this.driverService.registerDriver(driverData).subscribe(
        response => {
          this.message = 'We will get back to you within 5 working days.';
        },
        error => {
          console.error(error);
        }
      );
    }
  }
}
