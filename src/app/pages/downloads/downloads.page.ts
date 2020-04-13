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
import { NavController } from '@ionic/angular';
import { NetworkConnectionService } from 'src/app/core/services';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.page.html',
  styleUrls: ['./downloads.page.scss'],
})
export class DownloadsPage implements OnInit {

  downloadedFiles: FileModel[] = [];
  baseUrl = environment.fileBaseUrl;

  fileFromIdApi = 'user/get-filename';
  removeDownloadsApi = 'user/download/update/';
  online: boolean;

  private _unsubscribeServices: Subject<any> = new Subject();
  constructor(
    private localStorageService: LocalStorageService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private fileService: FileService,
    private translateService: TranslateService,
    public navCtrl: NavController,
    private networkService: NetworkConnectionService
  ) { }

  ngOnInit() {
    this.networkService.getNetworkStatus()
      .subscribe((status: boolean) => {
        this.online = status;
      });
  }

  ionViewDidEnter() {
    this.localStorageService.getIonicStorage(AppConstant.Downloads)
      .pipe(takeUntil(this._unsubscribeServices))
      .subscribe((files: FileModel[]) => {
        if (files) {
          this.downloadedFiles = files;
          // console.log('this.downloaded files', this.downloadedFiles);
        }
      });
  }

  download(file: FileModel, index: number) {
    if (file._source.fileId) {
      // const fileUrl = 'http://192.168.1.223:4010/upload/documents/1583321057473.pdf';
      // this.getFileData(file, 'download');
      this.downloadOfflineFile(file, 'download', index); // Offline
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
              this.fileDownloadAgain(filePath, file);
            } else {
              const fileUrl = this.baseUrl + filePath;
              this.fileService.downloadInIOS(fileUrl);
            }
          }
        }
      });
  }

  fileDownloadAgain(filePath: string, file: FileModel, index?: number) {
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
              if (filepathURL) {
                file._source.storedPath = filepathURL;
                this.downloadedFiles[index] = file;
                this.localStorageService.setIonicStorage(AppConstant.Downloads, this.downloadedFiles);
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
    if (this.downloadedFiles.length > 0 && this.downloadedFiles[i]._source._id) {
      this.setDownloadsEffect(this.downloadedFiles[i], i);
    }
  }

  openfile(file: FileModel, index: number) {
    if (file._source.fileId) {
      // this.getFileData(file, 'view');
      this.downloadOfflineFile(file, 'view', index); // Offline
    } else {
      this.toastrService.presentToast('noDocumentAvailable');
    }
  }

  setDownloadsEffect(file: FileModel, i: number) {
    if (this.online === false){
      this.toastrService.presentToast('removeDownloadError');
      return;
    }
      const params = {
        params: {
          fileID: file._source.fileId
        }
      };
    this.http.put<ApiResponseModel<any>>(this.removeDownloadsApi + file._source._id, params)
      .pipe(takeUntil(this._unsubscribeServices))
      .subscribe((response) => {
        if (response.code === 200) {
          this.downloadedFiles.splice(i, 1);
          this.localStorageService.setIonicStorage(AppConstant.Downloads, this.downloadedFiles);
        } else {
          this.toastrService.presentToast('somethingWentWrong');
        }
      })
  }

  downloadOfflineFile(file: FileModel, action: 'view' | 'download', index: number) {
    const filePath = file._source.filePath;
    if (filePath) {
      if (action === 'download') {
        this.fileDownloadAgain(filePath, file, index);
      } else {
        if (file._source.storedPath) {
          // console.log('stored path');
          const fileUrl = file._source.storedPath;
          this.fileService.fileOpen(fileUrl)
            .then(() => console.log(fileUrl + ' File is opened'))
            .catch(e => {
              console.log('file open error', e);
              this.toastrService.presentToast('fileNotInDevice');
            });
        } else {
          // console.log('online access');
          const fileUrl = this.baseUrl + filePath; // online
          this.fileService.downloadInIOS(fileUrl); // online
        }
      }
    }
  }

  ionViewDidLeave() {
    this._unsubscribeServices.next();
    this._unsubscribeServices.complete();
  }

}
