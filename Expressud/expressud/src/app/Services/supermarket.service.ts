import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../Shared1/models/Tag';
import { Super } from '../Shared1/models/super';

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http:HttpClient) { }

  getAll(): Observable<Super[]> {
    return this.http.get<Super[]>(`${this.baseUrl}/super`);
  }

  getAllSupersBySearchTerm(searchTerm: string) {
    return this.http.get<Super[]>(`${this.baseUrl}/super/search/${searchTerm}`);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/super/tags`);
  }

  getAllSupersByTag(tag: string): Observable<Super[]> {
    return tag === "All" ?
      this.getAll() :
      this.http.get<Super[]>(`${this.baseUrl}/super/tag/${tag}`);
  }

  getSuperById(superId:string):Observable<Super>{
    return this.http.get<Super>(`${this.baseUrl}/super/${superId}`);
  }
}
