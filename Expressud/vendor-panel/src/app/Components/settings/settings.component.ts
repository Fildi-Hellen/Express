import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../Services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
    this.profileForm = this.fb.group({
      storeName: ['', Validators.required],
      address: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      businessHours: ['', Validators.required],
      holidaySchedule: ['', Validators.required],
      paymentOptions: ['', Validators.required],
      shippingOptions: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.settingsService.getSettings().subscribe((settings) => {
      this.profileForm.patchValue(settings);
    });
  }

  saveSettings() {
    if (this.profileForm.valid) {
      this.settingsService.updateSettings(this.profileForm.value).subscribe(response => {
        alert('Settings updated successfully');
      }, error => {
        alert('Failed to update settings');
      });
    }
  }

}
