import { Component, OnInit } from '@angular/core';
import { AppConstant } from 'src/app/core/constants/app-constants';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { ToastrService } from '../../core/services/toastr.service';
import { LoadingService } from './../../core/services/loading.service';
import { ActivatedRoute } from '@angular/router';

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
  zoomTo = 0.80;
  routePage = 'home';

  constructor(
    private localStorageService: LocalStorageService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
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

    const pageName = this.activatedRoute.snapshot.params.page;
    if (pageName !== undefined) {
      if (pageName === 'bookmarks') {
        this.routePage = pageName;
        this.showAllPages = true;
      }
    }
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
    if (this.routePage === 'home') {
      this.isDisplayFile = true;
    }
  }

  onError() {
    this.loadingService.hideLoading();
    this.toastrService.presentToast('pdfFailError', 'bottom', false);
    this.isDisplayFile = false;
  }

  zoom_in() {
    this.zoomTo = Number((this.zoomTo + 0.25).toFixed(2));
  }

  zoom_out() {
    if (this.zoomTo > 0.80) {
      this.zoomTo = this.zoomTo - 0.25;
    }
  }

  ionViewDidLeave() {
    this.fileSrc = null;
    this.fileData = null;
    this.page = null;
    this.showAllPages = false;
    this.zoomTo = 0.80;
    this.routePage = 'home';
    this.localStorageService.removeIonicStorage(AppConstant.SelectedFile);
  }

}
