import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FileViewPage } from './file-view.page';

const routes: Routes = [
  {
    path: '',
    component: FileViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileViewPageRoutingModule {}
