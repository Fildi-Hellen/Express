import { Component, Input } from '@angular/core';
import { DriverService } from '../../Services/driver.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css'],
    standalone: false
})
export class SidenavComponent {
  constructor(public driverService: DriverService) {}
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
