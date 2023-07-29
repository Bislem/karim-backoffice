import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private JWT_TOKEN = 'JWT_TOKEN';

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem(this.JWT_TOKEN);
    console.log(token);
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + token),
        url: `${environment.API_BASE_URL}/${request.url}`
      });
      return next.handle(cloned);
    } else {
      const cloned = request.clone({
        url: `${environment.API_BASE_URL}/${request.url}`
      });
      return next.handle(cloned);
    }
  }
}
