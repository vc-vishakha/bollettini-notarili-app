import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChangePswdModel } from '../core/models';
import { ToastrService, LocalStorageService } from '../core/services';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppConstant } from '../core/constants/app-constants';
import { NgForm } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit, OnDestroy {

  changePswdForm: ChangePswdModel = new ChangePswdModel();
  passwordType: string = String('password');
  passwordIcon: string = String('eye-off');
  cnfPasswordType: string = String('password');
  cnfPasswordIcon: string = String('eye-off');
  requestProcess: boolean = Boolean(false);

  changePasswordAPI = 'user/change-password';
  userData: any;

  private unSubscribeService: Subject<any> = new Subject();

  constructor(
    private toastService: ToastrService,
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.localStorageService.getIonicStorage(AppConstant.LocalStorageKeys.temporaryUserData)
      .pipe(takeUntil(this.unSubscribeService))
      .subscribe((response) => {
        if (response && response.token && response.user) {
          this.userData = response;
        } else {
          this.router.navigate(['/login']);
        }
      });
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  hideCnfShowPassword() {
    this.cnfPasswordType = this.cnfPasswordType === 'text' ? 'password' : 'text';
    this.cnfPasswordIcon = this.cnfPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  changePassword(f: NgForm) {
    if (!this.changePswdForm.newPassword || !this.changePswdForm.confirmPassword) {
      return;
    } else if (this.changePswdForm.newPassword !== this.changePswdForm.confirmPassword) {
      this.toastService.presentToast('invalidConfirmPassword');
      return;
    }
    this.requestProcess = true;

    const params = {
      params: {
        password: this.changePswdForm.newPassword
      }
    };
    this.authService.changePassword(this.changePasswordAPI, params, this.userData.token)
      .pipe(takeUntil(this.unSubscribeService))
      .subscribe((res) => {
        this.localStorageService.setEncryptedLocalStorage(AppConstant.LocalStorageKeys.token, this.userData.token);
        this.localStorageService.setIonicStorage(AppConstant.LocalStorageKeys.token, this.userData.token);
        this.localStorageService.setIonicStorage(AppConstant.LocalStorageKeys.user, this.userData.user);
        this.authService.userSessionSubject.next(this.userData.user);
        this.router.navigate(['/home']);
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
    this.unSubscribeService.next();
    this.unSubscribeService.complete();
  }

}
