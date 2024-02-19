import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService: AuthService = inject(AuthService);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    const expirationDate = localStorage.getItem('expirationDate');
    let authRequest: HttpRequest<any>;
    if (!expirationDate) {
      authRequest = req.clone({
        headers: req.headers.set('authorization', 'matin ' + authToken),
      });
    } else {
      authRequest = req.clone({
        setHeaders: {
          authorization: 'matin ' + authToken,
          expirationDate,
        },
      });
    }

    return next.handle(authRequest);
  }
}
