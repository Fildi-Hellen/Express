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

  createBlog(blog: any): Observable<any> {
    return this.http.post(this.baseUrl, blog);
  }

  updateBlog(id: number, blog: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, blog);
  }

  deleteBlog(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

 
  deleteComment(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8000/api/comments/${id}`);
  }


}
