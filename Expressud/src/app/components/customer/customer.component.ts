import { Component } from '@angular/core';
import { CartService } from 'src/app/Services/cart.service';
import { MenuItemService } from 'src/app/Services/menu-item.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent {

  categories: any[] = [];
  establishments: any[] = [];
  menus: any[] = [];
  selectedCategory: string | null = null;
  selectedEstablishment: string | null = null;

  constructor(private menuitemService: MenuItemService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.menuitemService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => console.error('Error loading categories', error)
    });
  }

  loadEstablishments(category: string): void {
    this.selectedCategory = category;
    this.menuitemService.getEstablishmentsByCategory(category).subscribe({
      next: (response) => {
        console.log('API Response for Establishments:', response); // Log the response
        this.establishments = response.data; // Assign the data to establishments
      },
      error: (error) => {
        console.error('Error loading establishments:', error);
      }
    });
  }
  

  loadMenus(establishmentName: string): void {
    this.selectedEstablishment = establishmentName;
    this.menuitemService.getMenusByEstablishment(establishmentName).subscribe({
      next: (response) => {
        console.log('Menus API Response:', response); // Debug the response
        this.menus = response.data; // Ensure this matches the response structure
      },
      error: (error) => {
        console.error('Error loading menus:', error);
      },
    });
    
  }
  
  

  goBackToCategories(): void {
    this.selectedCategory = null;
    this.establishments = [];
  }

  goBackToEstablishments(): void {
    this.selectedEstablishment = null;
    this.menus = [];
  }


  // Add item to the cart
  addToCart(menu: any): void {
    this.cartService.addToCart(menu);
    alert(`${menu.name} has been added to your cart.`);
  }

proceedToCheckout(): void {
  // Navigate to the checkout page or handle checkout logic
  console.log('Proceeding to checkout...');
  // this.router.navigate(['/checkout']);
}



}
