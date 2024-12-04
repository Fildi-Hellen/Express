import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.css']
})
export class ApprovedComponent implements OnInit {
  menus: any[] = [];
  message: string = '';
  selectedMenu: any = {}; // Initialized to avoid null/undefined errors
  reason: string = '';
  additionalPrice: number = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchMenus();
    console.log(this.selectedMenu, this.reason);
  this.fetchMenus();
  }

  fetchMenus() {
    this.adminService.getIncomingMenus().subscribe(
      (response: any) => {
        this.menus = response.data;
      },
      (error) => {
        console.error('Failed to fetch menus', error);
      }
    );
  }

  approveMenu(menuId: string) {
    this.adminService.approveMenu(menuId, this.additionalPrice).subscribe(
      (response) => {
        this.message = response.message;
        this.fetchMenus(); // Refresh menu list
      },
      (error) => {
        console.error('Failed to approve menu', error);
      }
    );
  }

  disapproveMenu(menuId: string) {
    if (!this.reason || this.reason.trim() === '') {
      console.error('Disapproval reason is required.');
      this.message = 'Reason for disapproval is required.';
      return;
    }
  
    this.adminService.disapproveMenu(menuId, this.reason).subscribe(
      (response) => {
        this.message = response.message;
        this.fetchMenus(); // Refresh menu list
      },
      (error) => {
        console.error('Failed to disapprove menu', error);
      }
    );
  }
  

  editMenu(menuId: string) {
    const updatedData = {
      name: this.selectedMenu.name,
      description: this.selectedMenu.description,
      price: this.selectedMenu.price,
      availability: this.selectedMenu.availability,
    };

    this.adminService.editMenu(menuId, updatedData).subscribe(
      (response) => {
        this.message = response.message;
        this.fetchMenus(); // Refresh menu list
      },
      (error) => {
        console.error('Failed to edit menu', error);
      }
    );
  }
  

  setSelectedMenu(menu: any): void {
    this.selectedMenu = { ...menu }; // Create a copy to avoid binding issues
    this.reason = ''; // Reset disapproval reason
  }
  
  

}

