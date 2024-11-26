import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-customer-menu',
  templateUrl: './customer-menu.component.html',
  styleUrl: './customer-menu.component.css'
})
export class CustomerMenuComponent {

  menus: any[] = [];
  filterForm!: FormGroup;
  establishmentTypes = [
    { value: '', display: 'All' },
    { value: 'restaurant', display: 'Restaurant' },
    { value: 'retail', display: 'Retail Store' },
    { value: 'pharmacy', display: 'Pharmacy' },
    { value: 'florist', display: 'Florist' },
    { value: 'grocery', display: 'Grocery' },
    { value: 'realEstate', display: 'Real Estate' }
  ];

  constructor(private customerService: CustomerService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      establishmentType: ['']
    });

    this.loadMenus();

    this.filterForm.get('establishmentType')?.valueChanges.subscribe(() => {
      this.loadMenus();
    });
  }

  loadMenus() {
    const establishmentType = this.filterForm.get('establishmentType')?.value;
    this.customerService.getMenus(establishmentType).subscribe(
      (menus: any[]) => {
        this.menus = menus;
      },
      (error) => {
        console.error('Error fetching menus:', error);
      }
    );
  }
}
