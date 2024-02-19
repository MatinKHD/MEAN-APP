import { Injectable, inject } from '@angular/core';

import {
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from '../error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private dialog: MatDialog = inject(MatDialog);
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = 'an unknown error occured';
        if (error.error.message) {
          message = error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message } });
        return throwError(() => error);
      })
    );
  }
}
