import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../Shared1/models/Tag';
import { SWEETS_URL, SWEETS_BY_SEARCH_URL, SWEETS_TAGS_URL, SWEETS_BY_TAG_URL, SWEET_BY_ID_URL } from '../Shared1/constants/urls';
import { Sweet } from '../Shared1/models/sweet';
import { environment } from 'src/environments/environment.prod';
// import{sample_sweets,sample_tags} from 'src/sweete';
@Injectable({
  providedIn: 'root'
})
export class SweetService {
private base = environment.apiBase;
  constructor(private http:HttpClient) { }

  getAll(): Observable<Sweet[]> {
    return this.http.get<Sweet[]>(`${this.base}/sweets`);
  }

  getAllSweetsBySearchTerm(searchTerm: string) {
    return this.http.get<Sweet[]>(`${this.base}/sweets/search/${searchTerm}`);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.base}/sweets/tags`);
  }

  getAllSweetsByTag(tag: string): Observable<Sweet[]> {
    return tag === "All" ?
      this.getAll() :
      this.http.get<Sweet[]>(`${this.base}/sweets/tag/${tag}`);
  }

  getSweetById(sweetId:string):Observable<Sweet>{
    return this.http.get<Sweet>(`${this.base}/sweets/${sweetId}`);
  }
}
