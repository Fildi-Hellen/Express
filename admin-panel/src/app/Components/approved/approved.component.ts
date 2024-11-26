import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { Menu } from '../../Models/menu.model';


@Component({
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.css']
})
export class ApprovedComponent implements OnInit {

  menus: Menu[] = [];
  message!: string;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUnapprovedMenus();
  }

  loadUnapprovedMenus() {
    this.adminService.getUnapprovedMenus().subscribe(
      (menus: Menu[]) => {
        this.menus = menus;
      },
      (error) => {
        console.error('Error fetching unapproved menus:', error);
      }
    );
  }

  approveMenu(menuId: number) {
    this.adminService.approveMenu(menuId).subscribe(
      (response: any) => {
        this.message = 'Menu item approved.';
        this.loadUnapprovedMenus();
      },
      (error) => {
        console.error('Error approving menu:', error);
        this.message = 'Error approving menu.';
      }
    );
  }

}

