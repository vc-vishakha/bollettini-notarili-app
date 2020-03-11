import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FileViewPageRoutingModule } from './file-view-routing.module';

import { FileViewPage } from './file-view.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FileViewPageRoutingModule,
    PdfViewerModule,
    SharedModule
  ],
  declarations: [FileViewPage]
})
export class FileViewPageModule {}
