import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../Shared1/models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl ='http://localhost:8000/api';

  constructor(private http: HttpClient) {}


  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCategoryItems(categoryId: number): Observable<any[]> {
    // Adjust the URL and return type based on your API and data model
    return this.http.get<any[]>(`${this.apiUrl}/${categoryId}/items`);
  }
}
