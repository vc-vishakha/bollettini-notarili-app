import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core/';
import { environment } from 'src/environments/environment';

import { locale as italianLocale } from '../assets/i18n/it';
import { locale as englishLocale } from '../assets/i18n/en';
import { AuthService } from './core/services/auth.service';
import { NetworkConnectionService } from './core/services/network-connection.service';
import { PushNotificationService } from './core/services/push-notification.service';
import { TranslationLoaderService } from './core/services/translation-loader.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'src/app/core/services/toastr.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  isLoggedIn = false;
  private subs: Subscription;
  private unsubscribe: Subject<any> = new Subject();
  // @ViewChild(IonRouterOutlet, {read: IonRouterOutlet, static: true}) routerOutlet: IonRouterOutlet;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private pushNotificationService: PushNotificationService, // configure push notification
    private networkConnectionService: NetworkConnectionService,
    private authService: AuthService,
    private translateService: TranslateService,
    private translationLoaderService: TranslationLoaderService,
    private androidPermissions: AndroidPermissions,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.initializeApp();
    this.setLanguage();
    this.updateNetworkStatus();
    this.checkLoginStatus();
  }

  ionViewDidEnter() { }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushNotificationService.initPushNotification();
      this.getAndroidPermissions();

      if (this.platform.is('android')) {
        this.initBackButton();
      }
    });
  }

  /**
   * Translation config
   */
  setLanguage() {
    this.translateService.addLangs(['en', 'it']);
    this.translateService.setDefaultLang(environment.defaultLanguage);
    this.translateService.use(environment.defaultLanguage);
    this.translationLoaderService.loadTranslations(englishLocale, italianLocale);
  }

  /**
   * Checks network status as per device/browser connectivity
   */
  updateNetworkStatus() {
    this.networkConnectionService.getNetworkStatus()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((networkStatus: boolean) => {
        if (networkStatus) {
          // console.log('online');
        } else {
          // console.log('offline');
        }
      });
  }

  /**
   * Check if user logged in
   */
  checkLoginStatus() {
    this.authService.userSessionSubject.pipe(takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response && response !== null) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      });
  }

  getAndroidPermissions() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      result => {
        console.log('Has permission?', result.hasPermission);
        if (result.hasPermission === false) {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
            .then((value) => console.log('requestedPermission value', value))
            .catch((err) => console.log('requestedPermission err', err));
        }
      },
      () => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
      }
    );
  }

  initBackButton() {

    this.subs = this.platform.backButton.subscribeWithPriority(0, () => {
      // console.log('this.routerOutlet', this.routerOutlet);
      if (this.router.url.includes('file-view')) {
        if (this.router.url.includes('bookmarks')) {
          this.router.navigate(['/bookmarks']);
        } else {
          this.router.navigate(['/home']);
        }
      } else if (this.router.url === '/profile') {
        this.router.navigate(['/home']);
      } else {
        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          // tslint:disable-next-line: no-string-literal
          navigator['app'].exitApp();
        } else {
          this.toastrService.presentToast('exitMessage', 'bottom', false);
          this.lastTimeBackPress = new Date().getTime();
        }
      }
    });

  }

  ionViewWillLeave() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
    this.lastTimeBackPress = 0;
    this.timePeriodToExit = 2000;
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
