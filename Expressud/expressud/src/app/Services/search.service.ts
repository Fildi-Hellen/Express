import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private apiUrl = 'http://127.0.0.1:8000/api/search';

  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?query=${query}`);
  }
}
