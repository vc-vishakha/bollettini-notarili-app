import { Component, OnInit } from '@angular/core';
import { AppConstant } from 'src/app/core/constants/app-constants';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ToastrService } from '../../core/services/toastr.service';
import { LoadingService } from './../../core/services/loading.service';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.page.html',
  styleUrls: ['./file-view.page.scss'],
})
export class FileViewPage implements OnInit {

  fileSrc: any;
  page: number;
  showAllPages = false;
  fileData: { fileUrl: string, page: number };
  isDisplayFile = false;

  constructor(
    private localStorageService: LocalStorageService,
    private loadingService: LoadingService,
    private toastrService: ToastrService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.localStorageService.getIonicStorage(AppConstant.SelectedFile)
      .subscribe((fileData: { fileUrl: string, page: number }) => {
        if (fileData && fileData.fileUrl) {
          this.fileData = fileData;
          this.loadingService.showLoading();
          this.fileSrc = fileData.fileUrl; // use this for pdf-viewer
          if (fileData.page !== undefined && fileData.page !== null) {
            this.page = fileData.page;
          }
        }
      });
  }

  showAll() {
    if (this.fileSrc) {
      this.fileSrc = null;
      this.fileSrc = this.fileData.fileUrl;
      this.page = 1;
      this.showAllPages = true;
    }
  }

  onPDFRender() {
    this.loadingService.hideLoading();
    this.isDisplayFile = true;
  }

  onError() {
    this.loadingService.hideLoading();
    this.toastrService.presentToast('pdfFailError', 'bottom', false);
    this.isDisplayFile = false;
  }

  ionViewDidLeave() {
    this.fileSrc = null;
    this.fileData = null;
    this.page = null;
    this.showAllPages = false;
    this.localStorageService.removeIonicStorage(AppConstant.SelectedFile);
  }

}
