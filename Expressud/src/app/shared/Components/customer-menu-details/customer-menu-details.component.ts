import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AttributeKeyValue } from 'src/app/Models/attribute-key-value.model';
import { Menu } from 'src/app/Models/menu.model';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-customer-menu-details',
  templateUrl: './customer-menu-details.component.html',
  styleUrls: ['./customer-menu-details.component.css']
})
export class CustomerMenuDetailsComponent implements OnInit{

  menu!: Menu;
  additionalAttributes: AttributeKeyValue[] = [];

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    const menuId = this.route.snapshot.paramMap.get('id');
    if (menuId) {
      this.customerService.getMenuById(menuId).subscribe(
        (menu: Menu) => {
          this.menu = menu;

          // Construct the full image URL if necessary
          if (this.menu.image) {
            this.menu.imageUrl = `http://your-backend-url/storage/${this.menu.image}`;
          }

          // Process additional attributes
          if (this.menu.additionalAttributes) {
            this.additionalAttributes = Object.keys(this.menu.additionalAttributes).map(
              key => ({
                key: key,
                value: this.menu.additionalAttributes![key]
              })
            );
          }
        },
        (error) => {
          console.error('Error fetching menu:', error);
        }
      );
    }
  }
}
