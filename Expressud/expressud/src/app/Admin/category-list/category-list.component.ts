import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/Services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit{
  categories: any[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.loadCategories();
    });
  }

}
