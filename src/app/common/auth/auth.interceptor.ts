import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  constructor(
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem(this.authService.JWT_TOKEN);
    console.log(token);
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + JSON.parse(token)),
        // url: `${environment.API_BASE_URL}/${request.url}`
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}
