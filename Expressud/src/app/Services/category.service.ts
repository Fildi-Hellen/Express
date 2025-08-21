import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../Shared1/models/category';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private base = environment.apiBase;;

  constructor(private http: HttpClient) {}


  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.base);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.base}/${id}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.base, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.base}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getCategoryItems(categoryId: number): Observable<any[]> {
    // Adjust the URL and return type based on your API and data model
    return this.http.get<any[]>(`${this.base}/${categoryId}/items`);
  }
}
