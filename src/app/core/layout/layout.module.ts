import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { FooterPage } from './footer/footer.page';
import { HeaderPage } from './header/header.page';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverPage } from './header/popover/popover.page';


const layoutPages: any[] = [
  HeaderPage, FooterPage, PopoverPage
];

@NgModule({
  declarations: [
    layoutPages,
  ],
  entryComponents: [PopoverPage],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
  ],
  exports: [
    layoutPages,
    TranslateModule,
  ],
  providers: [],
})
export class LayoutModule { }
