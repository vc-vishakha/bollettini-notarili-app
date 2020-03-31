import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from './shared-material.module';
import { SharedFormsModule } from './shared-forms.module';
import { CoreModule } from '../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { ValidFileService } from '../core/services/valid-file.pipe';
import { LayoutModule } from '../core/layout/layout.module';

@NgModule({
  imports: [
    RouterModule,
    CoreModule,
    SharedMaterialModule,
    SharedFormsModule,
    // TranslateModule,
    LayoutModule
  ],
  exports: [
    RouterModule,
    CoreModule,
    SharedMaterialModule,
    SharedFormsModule,
    // TranslateModule,
    ValidFileService,
    LayoutModule
  ],
  declarations: [ValidFileService],
  providers: [],
})
export class SharedModule { }
