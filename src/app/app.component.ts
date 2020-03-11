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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  isLoggedIn = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private pushNotificationService: PushNotificationService, // configure push notification
    private networkConnectionService: NetworkConnectionService,
    private authService: AuthService,
    private translateService: TranslateService,
    private translationLoaderService: TranslationLoaderService,
  ) {
    this.initializeApp();
    this.setLanguage();
    this.updateNetworkStatus();
    this.checkLoginStatus();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushNotificationService.initPushNotification()
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
    this.networkConnectionService.getNetworkStatus().subscribe((networkStatus: boolean) => {
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
    this.authService.userSessionSubject.subscribe((response) => {
      if (response) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });
  }
}
