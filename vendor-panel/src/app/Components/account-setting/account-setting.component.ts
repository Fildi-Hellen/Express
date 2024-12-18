import { Component } from '@angular/core';
import { SettingsService } from '../../Services/settings.service';

@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent {

  credentials = { email: '', password: '' };
  notifications = { emailEnabled: false, smsEnabled: false };

  constructor(private SettingsService: SettingsService) {}

  updateCredentials() {
    this.SettingsService.changeLoginCredentials(this.credentials).subscribe({
      next: (res) => alert('Credentials updated successfully!'),
      error: (err) => console.error('Failed to update credentials', err)
    });
  }

  updateNotifications() {
    this.SettingsService.updateNotificationPreferences(this.notifications).subscribe({
      next: (res) => alert('Notification preferences updated successfully!'),
      error: (err) => console.error('Failed to update notification preferences', err)
    });
  }


}
