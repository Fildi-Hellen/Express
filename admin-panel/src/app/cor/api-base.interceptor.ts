import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // prod build must replace this

@Injectable()
export class ApiBaseInterceptor implements HttpInterceptor {
  // Matches http://localhost:8000/api... or http://127.0.0.1:8000/api...
  private bad = /^https?:\/\/(?:localhost|127(?:\.\d+){3}):8000\/api(.*)$/i;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = req.url;

    // Prefix relative URLs like "/admin/menus"
    if (url.startsWith('/')) {
      url = `${environment.apiBase}${url}`;
    }

    // Rewrite accidental absolute localhost URLs to prod
    const m = url.match(this.bad);
    if (m) {
      const path = (m[1] || '').replace(/^\/?/, '/'); // ensure single leading slash
      url = `${environment.apiBase}${path}`;
    }

    return next.handle(url === req.url ? req : req.clone({ url }));
  }
}
