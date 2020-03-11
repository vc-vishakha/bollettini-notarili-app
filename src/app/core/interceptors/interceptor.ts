import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../services';
import { AppConstant } from '../constants/app-constants';

@Injectable({
    providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
    jwtToken: string;
    apiPreFix: string = String(environment.serverUrl);
    constructor(
      private localStorageService: LocalStorageService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
      this.jwtToken = this.localStorageService.getDecryptedLocalStorage(AppConstant.LocalStorageKeys.token) || null;
        request = request.clone({
            url: this.apiPreFix + request.url,
        });
        if (this.jwtToken) {
          request = request.clone({
            setHeaders: {
              Authorization: this.jwtToken,
            },
          });
        }
        return next.handle(request);
    }

}
