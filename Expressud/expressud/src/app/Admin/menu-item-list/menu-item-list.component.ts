import { Component } from '@angular/core';
import { MenuItemService } from 'src/app/Services/menu-item.service';

@Component({
  selector: 'app-menu-item-list',
  templateUrl: './menu-item-list.component.html',
  styleUrls: ['./menu-item-list.component.css']
})
export class MenuItemListComponent {
  menuItems: any[] = [];

  constructor(private menuItemService: MenuItemService) {}

  ngOnInit() {
    this.loadMenuItems();
  }

  loadMenuItems() {
    this.menuItemService.getMenuItems().subscribe((items: any[]) => {
      this.menuItems = items.filter(item => item.status === 'pending');
    });
  }

  approveMenuItem(id: number) {
    this.menuItemService.approveMenuItem(id).subscribe(() => {
      this.loadMenuItems();
    });
  }

}
