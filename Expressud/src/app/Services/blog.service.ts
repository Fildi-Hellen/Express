import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private baseUrl = 'http://localhost:8000/api/blogs';

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
  
  likeBlog(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/like`, {});
  }

  addComment(id: number, comment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/comments`, comment);
  }


}
