import { Component, OnInit, ViewChild } from '@angular/core';
import { AppConstant } from 'src/app/core/constants/app-constants';
import { LocalStorageService, FileService, ToastrService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { NgModel } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, map, timeout } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { HomeService } from './home.service';
import { ApiResponseModel, Category, FileModel } from 'src/app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('searchInput', { read: NgModel, static: true }) searchInput: NgModel;
  baseUrl = environment.fileBaseUrl;
  search: string;
  searchedFiles: FileModel[] = [];
  selectedCategory: Category;
  searchFromBookmark: boolean;
  customAlertOptions: any;
  categoryList: Category[] = [];
  arr = Array;

  private _unsubscribeServices: Subject<any> = new Subject();

  constructor(
    private localStorageService: LocalStorageService,
    private fileService: FileService,
    private toastrService: ToastrService,
    private homeService: HomeService,
    private translateService: TranslateService,
    private router: Router,
    public inApp: InAppBrowser,
    private platform: Platform
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.localStorageService.removeIonicStorage(AppConstant.LocalStorageKeys.temporaryUserData);
    this.localStorageService.removeIonicStorage(AppConstant.SelectedFile);

    this.translateService.get('categories')
      .subscribe((text) => {
        let translated = 'Categories';
        if (text) {
          translated = text;
        }
        this.customAlertOptions = {
          header: translated,
          translucent: true
        };
      });

    if (this.searchInput) {
      this.getCategoryList();
      this.initSearch();
    }
  }

  viewFile(file: FileModel) {
    if (file._source && file._source.fileId) {
      this.getFileData(file, 'view');
    } else {
      this.toastrService.presentToast('noDocumentAvailable');
    }
  }

  fileActions(file: FileModel, filePath: string, action: 'view' | 'download') {
    let page = 1;
    page = file._source.location;
    if (file._source.location) {
      page = file._source.location;
    }
    const fileUrl = this.baseUrl + filePath;
    // console.log('url', fileUrl);
    // console.log('page', page);

    if (action === 'view') {
      const data = {
        fileUrl,
        page
      };
      this.localStorageService.setIonicStorage(AppConstant.SelectedFile, data);
      this.router.navigate(['/file-view']);
    } else if (action === 'download') {

      if (this.platform.is('ios')) {
        const IabOptions: InAppBrowserOptions = {
          location: 'yes',
          hidden: 'no',
          clearcache: 'yes',
          clearsessioncache: 'yes',
          zoom: 'yes', // Android only ,shows browser zoom controls
          hardwareback: 'yes',
          mediaPlaybackRequiresUserAction: 'no',
          shouldPauseOnSuspend: 'no', // Android only
          closebuttoncaption: 'Close', // iOS only
          disallowoverscroll: 'no', // iOS only
          toolbar: 'yes', // iOS only
          enableViewportScale: 'no', // iOS only
          allowInlineMediaPlayback: 'no',// iOS only
          presentationstyle: 'pagesheet',// iOS only
          fullscreen: 'yes',// Windows only
        }
        this.inApp.create(fileUrl, '_system', IabOptions);
      } else {
        this.fileService.checkDirDownload(fileUrl, file._source.title)
          .then((filepath) => {
            this.translateService.get('fileSavedMsg')
              .subscribe((text) => {
                let translated = 'File saved in';
                if (text) {
                  translated = text;
                }
                this.toastrService.presentToast(translated + ' ' + filepath);

                this.localStorageService.getIonicStorage(AppConstant.Downloads) // Temporary storage in ionic-storage
                  .pipe(takeUntil(this._unsubscribeServices))
                  .subscribe((downloaded) => {
                    if (!downloaded || downloaded.length === undefined) {
                      const data = [];
                      data.push(file);
                      this.localStorageService.setIonicStorage(AppConstant.Downloads, data);
                    } else if (downloaded.length !== undefined) {
                      downloaded.push(file);
                      this.localStorageService.setIonicStorage(AppConstant.Downloads, downloaded);
                    }
                  });

              });
          })
          .catch((err) => {
            this.toastrService.presentToast(err.message);
          });
      }

    }
  }

  bookmarkFile(file: FileModel) {
    if (file._source.fileId) {
      const params = {
        params: {
          bookmarkFileId: {
            fileID: file._source.fileId
          }

        }
      }
      this.homeService.bookmarkFile(params)
        .pipe(takeUntil(this._unsubscribeServices))
        .subscribe((response) => {
          if (response.code === 201) {
            this.toastrService.presentToast('addedToBookmarks');
          }
        })

    } else {
      this.toastrService.presentToast('noDocumentAvailable');
    }
  }

  downloadFile(file: FileModel) {
    if (file._source.fileId) {
      // const fileUrl = 'http://192.168.1.223:4010/upload/documents/1583321057473.pdf';
      this.getFileData(file, 'download');
    } else {
      this.toastrService.presentToast('noDocumentAvailable');
    }
  }

  /**
   * Initialize search
   */
  initSearch() {

    this.searchInput.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchTerm: string) => this.getSearchValue(searchTerm)),
        takeUntil(this._unsubscribeServices),
        map(response => response.data),
      )
      .subscribe(
        (resp: any) => {
          // console.log('resp', resp);
          if (resp.hits) {
            this.searchedFiles = resp.hits;
          } else {
            this.searchedFiles = [];
          }
        },
        (err) => {
          if (err && err.code === undefined) { // server stopped
            this.initSearch();
          }
        }
      );

  }

  getSearchValue(queryValue: string): Observable<ApiResponseModel<FileModel[]>> {
    // console.log('queryValue', queryValue);
    if (queryValue && queryValue.length > 0) {
      const params: any = {
        params: {
          term: queryValue,
          offset: 0
        }
      };
      if (this.selectedCategory) {
        params.params.categoryId = this.selectedCategory._id
      }
      if (this.searchFromBookmark === true) {
        params.params.bookmark = this.searchFromBookmark
      }
      return this.homeService.searchFiles(params);
    } else {
      const fakeData: ApiResponseModel<any> = {
        code: 200,
        message: '',
        data: []
      }
      return of(fakeData);
    }
  }

  /**
   * Search on category & bookmarks
   */
  searchUpdate() {
    if (this.search) {
      // console.log('search');
      this.resetSubject();
      this.getSearchValue(this.search)
        .pipe(
          takeUntil(this._unsubscribeServices),
          map(response => response.data),
        )
        .subscribe(
          (resp: any) => {
            if (resp.hits) {
              this.searchedFiles = resp.hits;
            } else {
              this.searchedFiles = [];
            }
          },
          (err) => { }
        );
    }
  }

  /**
   * Get category
   */
  getCategoryList() {

    this.homeService.getCategoryList()
      .pipe(takeUntil(this._unsubscribeServices))
      .subscribe((categoryData: ApiResponseModel<Category[]>) => {
        if (categoryData.code === 200) {
          this.categoryList = categoryData.data;
        }
      });

  }

  getFileData(file: FileModel, action: 'view' | 'download') {
    const fileParams = {
      params: {
        fileId: file._source.fileId
      }
    };
    this.homeService.getFileFormId(fileParams)
      .pipe(takeUntil(this._unsubscribeServices))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const filePath = resp.data.filePath;
          if (filePath) {
            this.fileActions(file, filePath, action);
          }
        }
      });
  }

  resetSubject() {
    this._unsubscribeServices.next();
    this._unsubscribeServices.complete();
    this._unsubscribeServices = new Subject();
    this.initSearch();
  }

  ionViewDidLeave() {
    this.search = '';
    this.selectedCategory = null;
    this.searchFromBookmark = false;
    this.searchedFiles = [];
    this._unsubscribeServices.next();
    this._unsubscribeServices.complete();
  }

}
