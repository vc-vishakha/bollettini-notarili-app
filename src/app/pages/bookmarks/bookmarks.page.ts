import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookmarkedFileModel } from 'src/app/core/models/bookmarks.model';
import { ToastrService } from 'src/app/core/services/toastr.service';
import { BookmarksService } from './bookmarks.service';
import { LocalStorageService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { AppConstant } from 'src/app/core/constants/app-constants';
import { environment } from 'src/environments/environment';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {

  bookmarkedFiles: BookmarkedFileModel[] = [];
  baseUrl = environment.fileBaseUrl;

  private _unsubscribeServices: Subject<any> = new Subject();
  constructor(
    private toastrService: ToastrService,
    private bookmarksService: BookmarksService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private platform: Platform,
    public navCtrl: NavController,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.getBookmarks();
    // this.initializeBackButtonCustomHandler();
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

  openFile(file: BookmarkedFileModel) {
    if (file.bookmarkFileId && file.bookmarkFileId.fileID && file.bookmarkFileId.fileID.filePath) {
      const fileUrl = this.baseUrl + file.bookmarkFileId.fileID.filePath;
      const data = {
        fileUrl,
        page: 1
      };
      this.localStorageService.setIonicStorage(AppConstant.SelectedFile, data);
      this.router.navigate(['/file-view/bookmarks']);
    } else {
      this.toastrService.presentToast('pdfFailError');
    }
  }

  initializeBackButtonCustomHandler() {
    if (this.platform.is('android')) {
      this.platform.ready().then(() => {
        document.addEventListener('backbutton', () => {

          console.log('bookmark back')
          this.navCtrl.back();
        });
      })
    }
  }

  ionViewDidLeave() {
    this._unsubscribeServices.next();
    this._unsubscribeServices.complete();
  }

}
