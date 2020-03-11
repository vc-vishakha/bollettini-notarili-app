import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { FooterPage } from './footer/footer.page';
import { HeaderPage } from './header/header.page';
import { TranslateModule } from '@ngx-translate/core';


const layoutPages: any[] = [
  HeaderPage, FooterPage
];

@NgModule({
  declarations: [
    layoutPages,
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forRoot(),
  ],
  exports: [
    layoutPages
  ],
  providers: [],
})
export class LayoutModule { }
