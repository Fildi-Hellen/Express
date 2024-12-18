import { Component } from '@angular/core';
import { SettingsService } from '../../Services/settings.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  personalInfo = { name: '', email: '', phone: '' };
  businessInfo = { businessName: '', taxId: '', description: '' };

  constructor(private SettingsService: SettingsService) {}

  updatePersonalInfo() {
    this.SettingsService.updatePersonalInfo(this.personalInfo).subscribe({
      next: (res) => alert('Personal information updated successfully!'),
      error: (err) => console.error('Failed to update personal information', err)
    });
  }

  updateBusinessInfo() {
    this.SettingsService.updateBusinessInfo(this.businessInfo).subscribe({
      next: (res) => alert('Business information updated successfully!'),
      error: (err) => console.error('Failed to update business information', err)
    });
  }


}
