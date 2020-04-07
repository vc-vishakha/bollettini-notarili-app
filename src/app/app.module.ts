import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { IonicStorageModule } from '@ionic/storage';
import { Push } from '@ionic-native/push/ngx';
import { LayoutModule } from './core/layout/layout.module';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { TranslateModule } from '@ngx-translate/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),

    LayoutModule,
    TranslateModule.forRoot(),
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    // tslint:disable-next-line: deprecation
    FileTransfer,
    File,
    InAppBrowser,
    Keyboard,
    AndroidPermissions,
    FileOpener,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
