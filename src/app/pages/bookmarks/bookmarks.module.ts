import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookmarksPageRoutingModule } from './bookmarks-routing.module';
import { BookmarksPage } from './bookmarks.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    BookmarksPageRoutingModule,
    SharedModule,
    FormsModule
  ],
  declarations: [BookmarksPage]
})
export class BookmarksPageModule {}
