import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<any> {
    return this.http.get(this.base);
  }

  createBlog(blog: any): Observable<any> {
    return this.http.post(this.base, blog);
  }

  updateBlog(id: number, blog: any): Observable<any> {
    return this.http.put(`${this.base}/${id}`, blog);
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

 
  deleteComment(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/comments/${id}`);
  }


}
