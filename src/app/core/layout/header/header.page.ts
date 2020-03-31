import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AppConstant } from './../../constants/app-constants';
import { PopoverPage } from './popover/popover.page';

@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss'],
})
export class HeaderPage implements OnInit {

  appName = AppConstant.appName;
  constructor(
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
