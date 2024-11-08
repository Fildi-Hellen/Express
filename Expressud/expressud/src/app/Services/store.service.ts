import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService <T> {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://127.0.0.1:8000/api'; // Adjust this URL as per your API

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/items`).pipe(
      catchError(this.handleError)
    );
  }

  getAllItemsBySearchTerm(searchTerm: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/items/search/${searchTerm}`).pipe(
      catchError(this.handleError)
    );
  }

  getItemById(itemId: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/items/${itemId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
