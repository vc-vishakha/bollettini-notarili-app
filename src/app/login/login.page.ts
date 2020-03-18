import { environment } from './../../environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { LoginModel } from '../core/models/login.model';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../core/services/local-storage.service';
import { AppConstant } from '../core/constants/app-constants';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  showHideActive: boolean = Boolean(false);
  currentLang: string = environment.defaultLanguage;
  loginForm: LoginModel = new LoginModel();
  userInfo: any = {};
  loginAPI = 'user/login';
  resData = 'data';

  passwordType: string = String('password');
  passwordIcon: string = String('eye-off');
  requestProcess: boolean = Boolean(false);
  deviceRegistrationId: string;

  private unSubscribeService: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.authService.logout(); // Remove all data if have any
  }

  ionViewDidEnter() {
    this.localStorageService.removeIonicStorage(AppConstant.LocalStorageKeys.temporaryUserData);
    this.authService.deviceRegId
      .pipe(takeUntil(this.unSubscribeService))
      .subscribe((deviceRegistrationId: string) => {
        if (deviceRegistrationId !== null) {
          this.deviceRegistrationId = deviceRegistrationId;
        }
      });
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  login(f: NgForm) {

    // this.requestProcess = true;
    if (!this.loginForm.email || !this.loginForm.password) {
      return;
    }
    const userEmail = this.loginForm.email.toLocaleLowerCase().trim();
    const userPassword = this.loginForm.password;

    const params: any = {
      params: {
        email: userEmail,
        password: userPassword
      }
    };
    if (this.deviceRegistrationId) {
      params.params.applicationToken = this.deviceRegistrationId;
    }
    this.requestProcess = true;

    this.authService.userLogin(this.loginAPI, params)
      .pipe(takeUntil(this.unSubscribeService))
      .subscribe((res) => {
        const userToken = res[this.resData].token;
        const userData = res[this.resData].user;
        // console.log('resp', res);
        if (userData.passwordResetStatus === false) {
          this.localStorageService.setIonicStorage(AppConstant.LocalStorageKeys.temporaryUserData, res[this.resData]);
          this.router.navigate(['/reset-password']);
        } else {
          this.localStorageService.setEncryptedLocalStorage(AppConstant.LocalStorageKeys.token, userToken);
          this.localStorageService.setIonicStorage(AppConstant.LocalStorageKeys.token, userToken);
          this.localStorageService.setIonicStorage(AppConstant.LocalStorageKeys.user, userData);
          this.authService.userSessionSubject.next(userData);
          this.router.navigate(['/home']);
        }
        f.resetForm();
      }, err => {
        this.requestProcess = false;
      }, () => {
        this.requestProcess = false;
      });
  }

  ngOnDestroy() {
    this.unSubscribeService.next();
    this.unSubscribeService.complete();
  }

  ionViewDidLeave() {
    this.requestProcess = false;
    this.passwordType = 'password';
    this.passwordIcon = 'eye-off';
  }

}

