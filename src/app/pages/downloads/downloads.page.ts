import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core/';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppConstant } from 'src/app/core/constants/app-constants';
import { ApiResponseModel } from 'src/app/core/models/api-response.model';
import { FileModel, SingleFile } from 'src/app/core/models/file.model';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { environment } from 'src/environments/environment';
import { FileService } from './../../core/services/file-opener.service';
import { ToastrService } from './../../core/services/toastr.service';
import { Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
export class DownloadsPage implements OnInit {

  downloadedFiles: FileModel[] = [];
  baseUrl = environment.fileBaseUrl;

  fileFromIdApi = 'user/get-filename';

  private _unsubscribeServices: Subject<any> = new Subject();
  constructor(
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private fileService: FileService,
    private translateService: TranslateService,
    private platform: Platform,
    public navCtrl: NavController,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.localStorageService.getIonicStorage(AppConstant.Downloads)
      .pipe(takeUntil(this._unsubscribeServices))
      .subscribe((files: FileModel[]) => {
        if (files) {
          this.downloadedFiles = files;
        }
      });
      // this.initializeBackButtonCustomHandler();
  }

  download(file: FileModel) {
    if (file._source.fileId) {
      // const fileUrl = 'http://192.168.1.223:4010/upload/documents/1583321057473.pdf';
      this.getFileData(file, 'download');
    } else {
      this.toastrService.presentToast('noDocumentAvailable');
    }
  }

  getFileData(file: FileModel, action: 'view' | 'download') {
    const fileParams = {
      params: {
        fileId: file._source.fileId
      }
    };
    this.http.post<ApiResponseModel<SingleFile>>(this.fileFromIdApi, fileParams)
      .pipe(takeUntil(this._unsubscribeServices))
      .subscribe((resp) => {
        if (resp.code === 200) {
          const filePath = resp.data.filePath;
          if (filePath) {
            if (action === 'download') {
              this.fileDownloadAgain(filePath);
            } else {
              const fileUrl = this.baseUrl + filePath;
              this.fileService.downloadInIOS(fileUrl);
            }
          }
        }
      });
  }

  fileDownloadAgain(filePath: string) {
    // let page = 1;
    // page = file._source.location;
    // if (file._source.location) {
    //   page = file._source.location;
    // }
    const fileUrl = this.baseUrl + filePath;
    this.fileService.checkDirDownload(fileUrl, filePath)
      .then((filepathURL) => {
        if (filepathURL !== '' && filepathURL !== null) {
          this.translateService.get('fileSavedMsg')
            .subscribe((text) => {
              let translated = 'File saved in';
              if (text) {
                translated = text;
              }
              this.toastrService.presentToast(translated + ' ' + filepathURL);
            });
        }
      })
      .catch((err) => {
        if (err.message === undefined) {
          if (err.code === 1) {
            this.toastrService.presentToast('noPermissionDownload');
          } else {
            this.toastrService.presentToast('downloadError');
          }
        } else {
          this.toastrService.presentToast(err.message);
        }
      });
  }

  removeDownload(i: number) {
    if (this.downloadedFiles.length > 0) {
      this.downloadedFiles.splice(i, 1);
      this.localStorageService.setIonicStorage(AppConstant.Downloads, this.downloadedFiles);
    }
  }

  openfile(file: FileModel) {
    if (file._source.fileId) {
      this.getFileData(file, 'view');
    } else {
      this.toastrService.presentToast('noDocumentAvailable');
    }
  }

  initializeBackButtonCustomHandler() {
    if (this.platform.is('android')) {
      this.platform.ready().then(() => {
        document.addEventListener('backbutton', () => {

          console.log('download back')
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
