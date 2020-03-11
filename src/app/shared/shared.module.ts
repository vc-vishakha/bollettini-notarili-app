import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from './shared-material.module';
import { SharedFormsModule } from './shared-forms.module';
import { CoreModule } from '../core/core.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    RouterModule,
    CoreModule,
    SharedMaterialModule,
    SharedFormsModule,
    TranslateModule,
  ],
  exports: [
    RouterModule,
    CoreModule,
    SharedMaterialModule,
    SharedFormsModule,
    TranslateModule,
  ],
  declarations: [],
  providers: [],
})
export class SharedModule { }
