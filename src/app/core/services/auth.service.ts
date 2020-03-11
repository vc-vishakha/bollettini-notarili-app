import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { AppConstant } from '../constants/app-constants';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root',
})

export class AuthService {

    userSessionSubject: BehaviorSubject<any> = new BehaviorSubject(null);
    deviceRegId: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(
      private httpClient: HttpClient,
      private localStorageService: LocalStorageService,
    ) {
        this.getUserObservables();
    }

    getUserObservables() {
        this.localStorageService.getIonicStorage(AppConstant.LocalStorageKeys.user)
            .subscribe((response) => {
              this.userSessionSubject.next(response);
            })
    }

    // userLoginss(dataURL): Observable<LoginModel[]> {
    //     return <Observable<LoginModel>this.httpClient.get(dataURL);
    // }

    userLogin(loginAPI: string, params: any): Observable<LoginModel> {
        return this.httpClient.post<LoginModel>(loginAPI, params)
        .pipe(map(resp => {
            return resp;
        }));
    }

    changePassword(changePasswordApi: string, params: any, token): Observable<any> {
      return this.httpClient.post<any>(changePasswordApi, params, {
        headers: {
          Authorization: token,
        }
      });
    }

    logout(): void {
      this.localStorageService.removeEncryptedLocalStorage(AppConstant.LocalStorageKeys.token);
      this.localStorageService.removeIonicStorage(AppConstant.LocalStorageKeys.token);
      this.localStorageService.removeIonicStorage(AppConstant.LocalStorageKeys.user);
      this.userSessionSubject.next(null);
    }

}
