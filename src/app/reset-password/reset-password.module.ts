import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResetPasswordPageRoutingModule } from './reset-password-routing.module';
import { ResetPasswordPage } from './reset-password.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ResetPasswordPageRoutingModule,
    SharedModule
  ],
  declarations: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}
