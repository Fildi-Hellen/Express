import { Component } from '@angular/core';
import { MenuItemService } from 'src/app/Services/menu-item.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
  
})
export class MenuComponent {
  menuItems: any[] = [];

  constructor(private menuItemService: MenuItemService) {}

  ngOnInit() {
    this.loadMenuItems();
  }

  loadMenuItems() {
    this.menuItemService.getMenuItems().subscribe((items: any[]) => {
      this.menuItems = items.filter(item => item.status === 'approved');
    });
  }

}
