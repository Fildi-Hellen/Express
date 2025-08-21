import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

private base = environment.apiBase;

  constructor(private http: HttpClient) { }

  sendFormData(formData: any): Observable<any> {
    return this.http.post<any>(this.base, formData);
  }
}
