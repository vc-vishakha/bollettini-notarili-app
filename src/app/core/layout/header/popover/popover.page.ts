import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core/';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
})
export class PopoverPage implements OnInit {

  logoutText = '';
  logoutConfirmText = '';
  constructor(
    private authService: AuthService,
    private router: Router,
    private popoverController: PopoverController,
    public alertController: AlertController,
    private translateService: TranslateService
  ) {
    this.translateService.get(['logoutConfirm', 'confirm'])
      .subscribe((textObj) => {
        // console.log('text', textObj);
        if ( textObj.logoutConfirm !== undefined ){
          this.logoutText = textObj.logoutConfirm;
        }
        if ( textObj.confirm !== undefined ){
          this.logoutConfirmText = textObj.confirm;
        }
      });
  }

  ngOnInit() {
  }

  async logout(): Promise<void> {

    const alert = await this.alertController.create({
      header: this.logoutConfirmText,
      // subHeader: 'Subtitle',
      message: this.logoutText,
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.popoverController.dismiss();
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.popoverController.dismiss()
              .then(() => {
                this.authService.logout();
                this.router.navigate(['/login']);
              })
          }
        }
      ]
    });

    await alert.present();

  }

  goToProfile() {
    this.popoverController.dismiss()
      .then(() => {
        this.router.navigate(['/profile']);
      })
  }

  goToBookmarks(){
    this.router.navigate(['/bookmarks'])
      .then(() => {
        this.popoverController.dismiss();
      });
  }

}
