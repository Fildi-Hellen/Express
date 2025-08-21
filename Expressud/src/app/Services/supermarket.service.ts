import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../Shared1/models/Tag';
import { Super } from '../Shared1/models/super';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SupermarketService {
private base = environment.apiBase;
  constructor(private http:HttpClient) { }

  getAll(): Observable<Super[]> {
    return this.http.get<Super[]>(`${this.base}/super`);
  }

  getAllSupersBySearchTerm(searchTerm: string) {
    return this.http.get<Super[]>(`${this.base}/super/search/${searchTerm}`);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.base}/super/tags`);
  }

  getAllSupersByTag(tag: string): Observable<Super[]> {
    return tag === "All" ?
      this.getAll() :
      this.http.get<Super[]>(`${this.base}/super/tag/${tag}`);
  }

  getSuperById(superId:string):Observable<Super>{
    return this.http.get<Super>(`${this.base}/super/${superId}`);
  }
}
