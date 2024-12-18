import { Component } from '@angular/core';
import { SettingsService } from '../../Services/settings.service';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.component.html',
  styleUrls: ['./profile-setting.component.css']
})
export class ProfileSettingComponent {

  personalInfo: any = {};
  businessInfo: any = {};

  constructor(private settingsService: SettingsService) {}

  updatePersonalInfo() {
    this.settingsService.updatePersonalInfo(this.personalInfo).subscribe(
      response => alert('Personal Info Updated Successfully!'),
      error => console.error('Error updating personal info', error)
    );
  }

  updateBusinessInfo() {
    this.settingsService.updateBusinessInfo(this.businessInfo).subscribe(
      response => alert('Business Info Updated Successfully!'),
      error => console.error('Error updating business info', error)
    );
  }


}
