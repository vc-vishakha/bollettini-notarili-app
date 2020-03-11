import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { DownloadsPageRoutingModule } from './downloads-routing.module';
import { DownloadsPage } from './downloads.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DownloadsPageRoutingModule,
    SharedModule
  ],
  declarations: [DownloadsPage]
})
export class DownloadsPageModule {}
