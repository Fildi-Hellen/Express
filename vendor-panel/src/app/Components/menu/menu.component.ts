import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../Services/menu.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls:['./menu.component.css'] 
})
export class MenuComponent  implements OnInit{

  menuForm!: FormGroup;
  selectedCategory!: string;
  establishmentName!: string;
  message!: string;
  menus: any[] = [];

  constructor(private fb: FormBuilder, private menuService: MenuService,private router: Router) {}
    ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/vendor/auth']);
      return;
    }

    this.initializeForm();
  }

  initializeForm() {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      availability: ['', Validators.required],
      cookTime: [''], // Required for restaurant
      expirationDate: [''], // Required for pharmacy
      manufacturingDate: [''], // Required for pharmacy
      location: [''], // Required for real estate
      size: [''], // Required for real estate
      acres: [''], // Required for real estate
      image: [null],
    });
  }

  onCategoryChange() {
    this.menuForm.reset(); // Reset form on category change
    this.menuForm.patchValue({
      category: this.selectedCategory,
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.menuForm.patchValue({
      image: file || null,
    });
  }

  onSubmit() {
    if (this.menuForm.invalid || !this.establishmentName) return;

    const menu = new FormData();
    Object.keys(this.menuForm.controls).forEach(key => {
      const value = this.menuForm.get(key)?.value;
      if (value) menu.append(key, value);
    });
    menu.append('category', this.selectedCategory);
    menu.append('establishmentName', this.establishmentName);

    this.menuService.addMenuItem(menu).subscribe(
      response => {
        this.menus.push(response.data);
        this.message = 'Menu item added successfully!';
        this.menuForm.reset();
      },
      error => {
        this.message = 'Failed to add menu item.';
        console.error(error);
      }
    );
  }

  deleteMenu(index: number, id: string) {
    this.menuService.deleteMenuItem(id).subscribe(
      () => {
        this.menus.splice(index, 1);
        this.message = 'Menu item deleted successfully.';
      },
      (error: any) => {
        this.message = 'Failed to delete menu item.';
      }
    );
  }

  submitToAdmin() {
    if (this.menus.length === 0) {
      this.message = 'No menus to submit.';
      return;
    }

    this.menuService.submitToAdmin(this.menus).subscribe(
      () => {
        this.message = 'Menus submitted to admin successfully!';
        this.menus = [];
      },
      (error: any) => {
        this.message = 'Failed to submit menus to admin.';
      }
    );
  }
  editMenu(index: number): void {
    const menuToEdit = this.menus[index];
  
    // Populate the form with the selected menu's details
    this.selectedCategory = menuToEdit.category;
    this.establishmentName = menuToEdit.establishmentName;
    this.menuForm.patchValue({
      name: menuToEdit.name,
      description: menuToEdit.description,
      price: menuToEdit.price,
      location: menuToEdit.location,
      size: menuToEdit.size,
      expirationDate: menuToEdit.expirationDate,
      cookTime: menuToEdit.cookTime,
      availability: menuToEdit.availability,
      image: null, // Image needs to be re-uploaded if edited
    });
  
    // Optionally, remove the item from the list if you want to re-add after editing
    // this.menus.splice(index, 1);
  }
  
}

