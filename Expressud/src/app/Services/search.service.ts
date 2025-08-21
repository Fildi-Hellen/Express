import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

private base = environment.apiBase;
  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    return this.http.get<any>(`${this.base}?query=${query}`);
  }
}
