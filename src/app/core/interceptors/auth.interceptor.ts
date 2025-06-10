import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private alertService: AlertService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');
    let cloneReq = req;
    if (token) {
      cloneReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloneReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error && error.error.detail === 'Could not validate credentials') {
            localStorage.removeItem('access_token');
            this.alertService.showAlert('info', 'Sesión expirada. Por favor, inicie sesión nuevamente.', 5000);
            this.router.navigate(['/auth/login']);
          }
          return throwError(() => {})
        })
      );
    }
    return next.handle(req);
  }
}
