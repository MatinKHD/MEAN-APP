import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpHandler,
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class PostInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = localStorage.getItem('user');
    let postRequest: HttpRequest<any>;
    if (req.url.split('/').includes('posts') && user) {
      postRequest = req.clone({
        setHeaders: {
          user,
        },
      });
    } else {
      postRequest = req;
    }
    return next.handle(postRequest);
  }
}
