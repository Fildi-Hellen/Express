import { Component } from '@angular/core';
import { DriverService } from '../../Services/driver.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  uploadedPicture: string | ArrayBuffer | null = null;

  constructor(private driverService: DriverService) {}

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedPicture = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // onUpload(): void {
  //   if (this.uploadedPicture) {
  //     this.driverService.uploadProfilePicture(this.uploadedPicture as string);
  //     alert('Profile picture uploaded successfully!');
  //   }
  // }
}
