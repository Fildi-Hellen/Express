import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // prod build must replace this

@Injectable()
export class ApiBaseInterceptor implements HttpInterceptor {
  // WHY: normalize once (no trailing slash)
  private readonly base = environment.apiBase.replace(/\/$/, '');
  // WHY: rewrite only localhost/127.* absolute URLs to prod
  private readonly localhost = /^https?:\/\/(?:localhost|127(?:\.\d+){3})(?::\d+)?(?<path>\/.*)?$/i;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let url = req.url;
    const isAbsolute = /^https?:\/\//i.test(url);

    if (!isAbsolute) {
      // Relative paths ("api/users" or "/api/users")
      const path = url.startsWith('/') ? url : `/${url}`;
      url = `${this.base}${path}`;
    } else {
      // Absolute URL: rewrite only if it's localhost/127.*
      const m = this.localhost.exec(url);
      if (m) {
        const path = (m.groups?.['path'] ?? '/');
        url = `${this.base}${path.startsWith('/') ? '' : '/'}${path}`;
      }
    }

    // Collapse multiple slashes in pathname (keep protocol intact)
    try {
      const u = new URL(url);
      u.pathname = u.pathname.replace(/\/{2,}/g, '/');
      url = u.toString();
    } catch {
      // ignore — if parse fails we keep original url
    }

    return next.handle(url === req.url ? req : req.clone({ url }));
  }
}