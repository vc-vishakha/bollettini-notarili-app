import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from '../services/toastr.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
      private authService: AuthService,
      private toastService: ToastrService,
      private router: Router
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError(err => {
              if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authService.logout();
                this.toastService.presentToast('userNotExist', 'top');
                this.router.navigate(['/login']);
              } else if (err.status === 400) {
                this.toastService.presentToast('badRequest', 'top');
                this.router.navigate(['/']);
              } else if (err.status === 402) {
                this.toastService.presentToast('inactiveUser', 'top');
              } else if (err.status === 404 ) {
                if (request.url.endsWith('user/login') ){
                  this.toastService.presentToast('invalidEmailPassword', 'top');
                }
              } else if (err.status === 500) {
                this.toastService.presentToast('internalServer', 'top');
                // this.router.navigate(['/']);
              } else if (err.status === 0) {
                this.toastService.presentToast('somethingWentWrong', 'top');
              } else {
                if (err.error.message) {
                  this.toastService.presentToast(err.error.message);
                } else {
                  this.toastService.presentToast(err.message);
                }
              }
                const error = err.error || err;
                return throwError(error);
            })
        );
    }
}
