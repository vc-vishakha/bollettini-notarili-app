import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AppConstant } from '../constants/app-constants';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,
    ) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        const jwtModel = this.localStorageService.getDecryptedLocalStorage(AppConstant.LocalStorageKeys.token);
        if (jwtModel) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }

}



@Injectable({ providedIn: 'root' })
export class LoginAuthGuard implements CanActivate {
    userLoginInformation: any;
    constructor(
        private router: Router,
        private localStorageService: LocalStorageService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        const jwtModel = this.localStorageService.getDecryptedLocalStorage(AppConstant.LocalStorageKeys.token);
        if (!jwtModel) {
            // not logged in so return true
            return true;
        } else {
            // logged in so redirect to main page
            this.router.navigate(['/home']);
            return false;
        }

    }
}