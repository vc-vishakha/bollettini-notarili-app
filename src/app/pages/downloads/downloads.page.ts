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
    private translateService: TranslateService
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
  }

  download(file: FileModel, index: number) {
    if (file._source.fileId) {
      // const fileUrl = 'http://192.168.1.223:4010/upload/documents/1583321057473.pdf';
      this.getFileData(file);
    } else {
      this.toastrService.presentToast('noDocumentAvailable');
    }
  }

  getFileData(file: FileModel) {
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
            this.fileDownloadAgain(file, filePath);
          }
        }
      });
  }

  fileDownloadAgain(file, filePath) {
    let page = 1;
    page = file._source.location;
    if (file._source.location) {
      page = file._source.location;
    }
    const fileUrl = this.baseUrl + filePath;
    this.fileService.checkDirDownload(fileUrl, filePath)
      .then((filepath) => {
        this.translateService.get('fileSavedMsg')
          .subscribe((text) => {
            let translated = 'File saved in';
            if (text) {
              translated = text;
            }
            this.toastrService.presentToast(translated + ' ' + filepath);

          });
      })
      .catch((err) => {
        this.toastrService.presentToast(err.message);
      });
  }

  ionViewDidLeave() {
    this._unsubscribeServices.next();
    this._unsubscribeServices.complete();
  }

}
