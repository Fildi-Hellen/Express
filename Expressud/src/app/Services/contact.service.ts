import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

 private base = environment.apiBase; 

  constructor(private http: HttpClient) { }

   sendFormData(payload: {name:string; email:string; subject:string; message:string}): Observable<any> {
    return this.http.post<any>(`${this.base}/contact`, payload)
      .pipe(catchError((e: HttpErrorResponse) => {
        console.error('ContactService error:', e);
        return throwError(() => e);
      }));
  }
  
}


