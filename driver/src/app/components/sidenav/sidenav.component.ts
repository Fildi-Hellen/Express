import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DriverService } from '../../Services/driver.service';
import { ProfileStateService } from '../../Services/profile-state.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css'],
    standalone: false
})
export class SidenavComponent implements OnInit, OnDestroy {
  
  // Driver profile data
  driverProfile: any = {
    name: '',
    profile_picture_url: null
  };
  
  isLoggedIn: boolean = false;
  private profileSubscription: Subscription = new Subscription();
  
  constructor(
    public driverService: DriverService,
    private profileStateService: ProfileStateService
  ) {}
  
  ngOnInit(): void {
    this.checkAuthAndLoadProfile();
    
    // Subscribe to profile updates
    this.profileSubscription = this.profileStateService.profileData$.subscribe(
      (profileData) => {
        this.driverProfile = profileData;
      }
    );
  }
  
  ngOnDestroy(): void {
    this.profileSubscription.unsubscribe();
  }
  
  checkAuthAndLoadProfile(): void {
    const token = localStorage.getItem('authToken');
    const driverId = localStorage.getItem('driverId');
    this.isLoggedIn = !!(token && driverId);
    
    if (this.isLoggedIn) {
      this.loadDriverProfile();
    }
  }
  
  loadDriverProfile(): void {
    const driverId = localStorage.getItem('driverId');
    
    if (driverId) {
      this.driverService.getDriverProfile(parseInt(driverId)).subscribe({
        next: (response) => {
          let profileData;
          if (response.success && response.data) {
            profileData = response.data;
          } else if (response.data) {
            profileData = response.data;
          } else {
            profileData = response;
          }
          
          this.driverProfile = {
            name: profileData.name || '',
            profile_picture_url: profileData.profile_picture_url || null
          };
          
          // Update the shared state
          this.profileStateService.updateProfileData(this.driverProfile);
        },
        error: (error) => {
          console.error('Error loading profile for navbar:', error);
        }
      });
    }
  }
  
  getProfilePictureUrl(): string {
    if (this.driverProfile.profile_picture_url) {
      return this.driverProfile.profile_picture_url;
    }
    // Return default gravatar as fallback
    return 'https://secure.gravatar.com/avatar/d09eaad01aea86c51b4f892b4f8abf6f?s=100&d=wavatar&r=g';
  }
  
  getProfileInitials(): string {
    if (this.driverProfile.name) {
      const names = this.driverProfile.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return 'DR'; // Default "Driver"
  }
  
  //Sidebar toggle show hide function
  status = false;
  addToggle()
  {
    this.status = !this.status;       
  }
}

// <div class="profile-container">
//         <ng-container *ngIf="driverService.isLoggedIn(); else loginIcon">
//           <a routerLink="/profile" class="profile">
//             <img 
//               [src]="driverService.getProfilePicture() || 'https://via.placeholder.com/100'"
//               alt="Profile Picture"
//               class="profile-picture"
//             />
//           </a>
//         </ng-container>
//         <ng-template #loginIcon>
//           <a routerLink="/login" class="login-icon">
//             <i class="bx bxs-user-circle"></i> <!-- Login Icon -->
//           </a>
//         </ng-template>
//       </div>
