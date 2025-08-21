import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class StoreService <T> {

  constructor(private http: HttpClient) { }
private base = environment.apiBase;
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.base}/items`).pipe(
      catchError(this.handleError)
    );
  }

  getAllItemsBySearchTerm(searchTerm: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.base}/items/search/${searchTerm}`).pipe(
      catchError(this.handleError)
    );
  }

  getItemById(itemId: string): Observable<T> {
    return this.http.get<T>(`${this.base}/items/${itemId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
