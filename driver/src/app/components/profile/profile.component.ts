import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../Services/driver.service';
import { ProfileStateService } from '../../Services/profile-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // Profile data
  driverProfile: any = {
    name: '',
    email: '',
    phone: '',
    vehicle_type: '',
    vehicle_number: '',
    vehicle_model: '',
    license_plate: '',
    profile_picture: null,
    account_name: '',
    account_number: '',
    bank_name: '',
    rating: null
  };

  // Login/Auth state
  isLoggedIn: boolean = false;
  showLoginForm: boolean = false;
  showRegistrationForm: boolean = false;
  
  // Login credentials
  loginEmail: string = '';
  loginPassword: string = '';
  
  // Registration data
  registrationData = {
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicle_type: '',
    vehicle_number: '',
    vehicle_model: '',
    license_plate: ''
  };

  // Profile picture upload
  uploadedPicture: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isUploading: boolean = false;
  
  // Edit mode
  isEditing: boolean = false;
  
  // Loading states
  isLoading: boolean = false;
  isSaving: boolean = false;

  constructor(
    private driverService: DriverService,
    private profileStateService: ProfileStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    if (this.isLoggedIn) {
      this.loadDriverProfile();
    } else {
      // For testing - check if we have driver data in localStorage
      const driverId = localStorage.getItem('driverId');
      if (driverId) {
        console.log('Found driverId in storage:', driverId);
        // Set logged in status and try loading profile
        this.isLoggedIn = true;
        this.loadDriverProfile();
      }
    }
  }

  checkAuthStatus(): void {
    const token = localStorage.getItem('authToken');
    const driverId = localStorage.getItem('driverId');
    this.isLoggedIn = !!(token && driverId);
    
    console.log('Auth status check:', {
      token: !!token,
      driverId: driverId,
      isLoggedIn: this.isLoggedIn
    }); // Debug log
  }

  loadDriverProfile(): void {
    this.isLoading = true;
    const driverId = localStorage.getItem('driverId');
    
    if (driverId) {
      this.driverService.getDriverProfile(parseInt(driverId)).subscribe({
        next: (response) => {
          console.log('Profile response:', response); // Debug log
          
          let profileData;
          // Handle the response structure properly
          if (response.success && response.data) {
            profileData = response.data;
          } else if (response.data) {
            profileData = response.data;
          } else {
            profileData = response;
          }
          
          // Convert null values to empty strings for form fields
          this.driverProfile = {
            ...profileData,
            name: profileData.name || '',
            email: profileData.email || '',
            phone: profileData.phone || '',
            vehicle_type: profileData.vehicle_type || '',
            vehicle_number: profileData.vehicle_number || '',
            vehicle_model: profileData.vehicle_model || '',
            license_plate: profileData.license_plate || '',
            account_name: profileData.account_name || '',
            account_number: profileData.account_number || '',
            bank_name: profileData.bank_name || '',
            rating: profileData.rating || null,
            profile_picture: profileData.profile_picture || null,
            profile_picture_url: profileData.profile_picture_url || null
          };
          
          console.log('Driver profile loaded:', this.driverProfile); // Debug log
          
          // Update shared state for navbar
          this.profileStateService.updateProfileData({
            name: this.driverProfile.name,
            profile_picture_url: this.driverProfile.profile_picture_url
          });
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.isLoading = false;
        }
      });
    }
  }

  // Authentication methods
  showLogin(): void {
    this.showLoginForm = true;
    this.showRegistrationForm = false;
  }

  showRegistration(): void {
    this.showRegistrationForm = true;
    this.showLoginForm = false;
  }

  hideAuthForms(): void {
    this.showLoginForm = false;
    this.showRegistrationForm = false;
    this.clearAuthForms();
  }

  login(): void {
    if (!this.loginEmail || !this.loginPassword) {
      alert('Please enter email and password');
      return;
    }

    this.isLoading = true;
    this.driverService.loginDriver({
      email: this.loginEmail,
      password: this.loginPassword
    }).subscribe({
      next: (response) => {
        if (response.driver && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('driverId', response.driver.id.toString());
          this.isLoggedIn = true;
          this.hideAuthForms();
          this.loadDriverProfile();
          alert('Login successful!');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
        this.isLoading = false;
      }
    });
  }

  register(): void {
    // Validate required fields
    if (!this.registrationData.name || !this.registrationData.email || 
        !this.registrationData.password || !this.registrationData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    this.isLoading = true;
    this.driverService.registerDriver(this.registrationData).subscribe({
      next: (response) => {
        if (response.token && response.driver) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('driverId', response.driver.id.toString());
          this.isLoggedIn = true;
          this.hideAuthForms();
          this.loadDriverProfile();
          alert('Registration successful!');
        } else {
          alert('Registration successful! Please login.');
          this.showLogin();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Registration error:', error);
        if (error.error && error.error.errors) {
          const errors = error.error.errors;
          let errorMessage = 'Registration failed:\n';
          Object.keys(errors).forEach(key => {
            errorMessage += `${key}: ${errors[key].join(', ')}\n`;
          });
          alert(errorMessage);
        } else {
          alert('Registration failed. Please try again.');
        }
        this.isLoading = false;
      }
    });
  }

  logout(): void {
    this.driverService.logoutDriver().subscribe({
      next: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('driverId');
        this.isLoggedIn = false;
        this.driverProfile = {};
        this.clearAuthForms();
        alert('Logged out successfully');
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Clear local storage anyway
        localStorage.removeItem('authToken');
        localStorage.removeItem('driverId');
        this.isLoggedIn = false;
        this.driverProfile = {};
      }
    });
  }

  // Profile management methods
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    this.isSaving = true;
    
    // Clean the profile data before sending - convert null values to empty strings
    const cleanedProfile = {
      ...this.driverProfile,
      vehicle_model: this.driverProfile.vehicle_model || '',
      license_plate: this.driverProfile.license_plate || '',
      account_name: this.driverProfile.account_name || '',
      account_number: this.driverProfile.account_number || '',
      bank_name: this.driverProfile.bank_name || ''
    };
    
    console.log('Saving profile:', cleanedProfile); // Debug log
    
    this.driverService.updateDriverProfile(cleanedProfile).subscribe({
      next: (response) => {
        console.log('Profile save response:', response); // Debug log
        
        // Handle the response structure properly
        if (response.success && response.data) {
          this.driverProfile = { ...response.data };
        } else if (response.data) {
          this.driverProfile = { ...response.data };
        } else {
          this.driverProfile = { ...response };
        }
        
        this.isEditing = false;
        this.isSaving = false;
        alert('Profile updated successfully!');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        
        // Show detailed error message
        if (error.error && error.error.errors) {
          const errors = error.error.errors;
          let errorMessage = 'Profile update failed:\n';
          Object.keys(errors).forEach(key => {
            errorMessage += `${key}: ${errors[key].join(', ')}\n`;
          });
          alert(errorMessage);
        } else {
          alert('Failed to update profile. Please try again.');
        }
        
        this.isSaving = false;
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadDriverProfile(); // Reload original data
  }

  // Profile picture methods
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedPicture = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      alert('Please select a picture first');
      return;
    }

    this.isUploading = true;
    
    this.driverService.uploadProfilePicture(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload response:', response); // Debug log
        
        // Store both the URL and clear the temporary uploaded picture
        this.driverProfile.profile_picture_url = response.profile_picture_url;
        
        // Update shared state for navbar
        this.profileStateService.updateProfileData({
          name: this.driverProfile.name,
          profile_picture_url: this.driverProfile.profile_picture_url
        });
        
        // Clear temporary upload state
        this.uploadedPicture = null;
        this.selectedFile = null;
        this.isUploading = false;
        
        alert('Profile picture uploaded successfully!');
      },
      error: (error) => {
        console.error('Error uploading picture:', error);
        alert('Failed to upload picture. Please try again.');
        this.isUploading = false;
      }
    });
  }

  removeProfilePicture(): void {
    if (confirm('Are you sure you want to remove your profile picture?')) {
      this.driverService.removeProfilePicture().subscribe({
        next: () => {
          this.driverProfile.profile_picture = null;
          this.driverProfile.profile_picture_url = null;
          this.uploadedPicture = null;
          this.selectedFile = null;
          
          // Update shared state for navbar
          this.profileStateService.updateProfileData({
            name: this.driverProfile.name,
            profile_picture_url: null
          });
          
          alert('Profile picture removed successfully!');
        },
        error: (error) => {
          console.error('Error removing picture:', error);
          alert('Failed to remove picture. Please try again.');
        }
      });
    }
  }

  // Helper methods
  clearAuthForms(): void {
    this.loginEmail = '';
    this.loginPassword = '';
    this.registrationData = {
      name: '',
      email: '',
      password: '',
      phone: '',
      vehicle_type: '',
      vehicle_number: '',
      vehicle_model: '',
      license_plate: ''
    };
  }

  getProfilePictureUrl(): string {
    if (this.uploadedPicture) {
      return this.uploadedPicture as string;
    }
    // Check for profile_picture_url first (from API response)
    if (this.driverProfile.profile_picture_url) {
      return this.driverProfile.profile_picture_url;
    }
    // Fallback to profile_picture field
    if (this.driverProfile.profile_picture) {
      return this.driverProfile.profile_picture;
    }
    return ''; // Return empty string to show placeholder
  }

  getProfileInitials(): string {
    if (this.driverProfile.name) {
      const names = this.driverProfile.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return 'DP'; // Default "Driver Profile"
  }

  // Debug method - remove in production
  testLoadProfile(): void {
    // Manually set the driver ID and token for testing
    localStorage.setItem('driverId', '3');
    localStorage.setItem('authToken', 'test-token');
    this.isLoggedIn = true;
    this.loadDriverProfile();
  }

  // Debug method - populate with test data
  loadTestData(): void {
    this.driverProfile = {
      id: 3,
      name: "James Jimmy",
      email: "xyz@gmail.com",
      phone: "0780000000",
      vehicle_type: "car",
      vehicle_number: "232",
      vehicle_model: null,
      license_plate: null,
      rating: 5,
      profile_picture: null
    };
    this.isLoggedIn = true;
  }
}
