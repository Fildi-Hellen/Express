import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/Services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode: boolean = false;
  categoryId!: number;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      photoUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = params['id'];
        this.loadCategory(this.categoryId);
      }
    });
  }

  loadCategory(id: number) {
    this.categoryService.getCategory(id).subscribe(category => {
      this.categoryForm.patchValue(category);
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.categoryService.updateCategory(this.categoryId, this.categoryForm.value).subscribe(() => {
        this.router.navigate(['/admin/categories']);
      });
    } else {
      this.categoryService.createCategory(this.categoryForm.value).subscribe(() => {
        this.router.navigate(['/admin/categories']);
      });
    }
  }

}
