import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class ToastrService {
  currentLang: string = environment.defaultLanguage;
  duration = 3000;

  constructor(
    public toastController: ToastController,
    private translateService: TranslateService,
  ) { }

  languageOnChange() {
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang;
    });
  }

  async presentToast(message: string, toastPosition: 'top' | 'bottom' = 'bottom', showCancel = true) {
    let msg = this.translateService.translations[this.currentLang][message];
    if (msg === undefined) {
      msg = message;
    }
    const buttons = [];
    if (showCancel) {
      buttons.push(
        {
          icon: 'close-outline',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      )
    }
    const toast = await this.toastController.create({
      message: msg,
      duration: this.duration,
      position: toastPosition,
      buttons,
      color: 'medium',
      mode: 'ios'
    });
    await toast.present();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}
