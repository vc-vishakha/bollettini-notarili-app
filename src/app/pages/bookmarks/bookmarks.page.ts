import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookmarkedFileModel } from 'src/app/core/models/bookmarks.model';
import { ToastrService } from 'src/app/core/services/toastr.service';
import { BookmarksService } from './bookmarks.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {

  bookmarkedFiles: BookmarkedFileModel[] = [];

  private _unsubscribeServices: Subject<any> = new Subject();
  constructor(
    private toastrService: ToastrService,
    private bookmarksService: BookmarksService
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.getBookmarks();
  }

  getBookmarks() {
    this.bookmarksService.getBookmarkList()
      .pipe(takeUntil(this._unsubscribeServices))
      .subscribe((resp) => {
        if (resp.data) {
          this.bookmarkedFiles = resp.data;
        }
      });
  }

  removeBookmark(bookmark: BookmarkedFileModel) {
    if (bookmark.bookmarkFileId && bookmark.bookmarkFileId.fileID && bookmark.bookmarkFileId.fileID._id) {
      const id = bookmark._id;
      const params = {
        params: {
          fileID: bookmark.bookmarkFileId.fileID._id,
        }
      }
      this.bookmarksService.removeBookmark(id, params)
        .pipe(takeUntil(this._unsubscribeServices))
        .subscribe((resp) => {
          if (resp.code === 200) {
            this.toastrService.presentToast('removedFromBookmarks');
            this.getBookmarks();
          }
        });
    } else {
      this.toastrService.presentToast('unableToRemoveBookmark');
    }

  }

  ionViewDidLeave() {
    this._unsubscribeServices.next();
    this._unsubscribeServices.complete();
  }

}
