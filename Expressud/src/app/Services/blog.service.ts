import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

 private base = environment.apiBase;;

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<any> {
    return this.http.get(this.base);
  }
  
  likeBlog(id: number): Observable<any> {
    return this.http.post(`${this.base}/${id}/like`, {});
  }

  addComment(id: number, comment: any): Observable<any> {
    return this.http.post(`${this.base}/${id}/comments`, comment);
  }


}
