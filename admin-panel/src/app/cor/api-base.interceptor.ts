import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiBaseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Prefix relative API calls like "/users"
    if (req.url.startsWith('/')) {
      return next.handle(req.clone({ url: `${environment.apiBase}${req.url}` }));
    }
    // Rewrite accidental localhost/127 calls
    const bad = /(localhost|127\.0\.0\.1):8000\/api/;
    if (bad.test(req.url)) {
      const path = req.url.replace(/^https?:\/\/(localhost|127\.0\.0\.1):8000\/api/, '');
      const fixed = `${environment.apiBase}${path.startsWith('/') ? path : '/' + path}`;
      return next.handle(req.clone({ url: fixed }));
    }
    return next.handle(req);
  }
}
