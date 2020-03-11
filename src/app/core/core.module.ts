import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ErrorInterceptor } from '../core/interceptors/error-interceptor';
import { InterceptorService } from '../core/interceptors/interceptor';
import { Network } from '@ionic-native/network/ngx';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ],
  providers: [
    Network,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true, },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true, },
  ]
})
export class CoreModule { }
