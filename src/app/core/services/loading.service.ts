import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  currentLang: string = environment.defaultLanguage;
  duration = 3000;
  loading: HTMLIonLoadingElement;

  constructor(
    public loadingController: LoadingController,
    private translateService: TranslateService,
  ) { }

  languageOnChange() {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
    });
  }

  async showLoading(message: string = 'pleaseWait', duration = 0) {
    let msg = this.translateService.translations[this.currentLang][message];
    if (msg === undefined) {
      msg = message;
    }
    this.loading = await this.loadingController.create({
      spinner: 'circles',
      duration,
      message: msg,
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: false
    });
    await this.loading.present();
  }

  async hideLoading() {
    if (this.loading) {
      await this.loading.dismiss();
    }
  }
}
