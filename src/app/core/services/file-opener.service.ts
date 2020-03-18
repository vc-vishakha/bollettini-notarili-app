import { Injectable } from '@angular/core';
import { AppConstant } from 'src/app/core/constants/app-constants';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    // tslint:disable-next-line: deprecation
    private transfer: FileTransfer,
    private file: File,
    private platform: Platform,
    public inApp: InAppBrowser,
  ) { }

  identifyMimeType(ext: string): string {
    if (AppConstant.ExtToMimes.hasOwnProperty(ext)) {
      return AppConstant.ExtToMimes[ext];
    } else {
      return 'application/pdf';
    }
  }

  /**
   * Checks directory & downloads in it.
   * Creates dir if not one
   * @param url File url
   * @param filename File name
   */
  checkDirDownload(url: string, filename: string): Promise<string> {
    return new Promise((resolve, reject) => {

      if (this.platform.is('ios')) {

        this.downloadInIOS(url);
        resolve(null);

      } else if (this.platform.is('cordova')) {
        const fileTransfer = this.transfer.create();
        let message: string;
        this.file.checkDir(this.file.externalRootDirectory, AppConstant.FileStoreDir)
          .then(
            // Directory exists, check for file with the same name
            () => this.file.checkFile(this.file.externalRootDirectory, AppConstant.FileStoreDir + '/' + filename)
              .then(() => {
                const timestamp = new Date().getTime();
                const ext = filename.substr(filename.lastIndexOf('.') + 1);
                const subs = filename.substring(0, filename.lastIndexOf(ext) - 1);
                const newFileName = subs + '_' + timestamp + '.' + ext;
                fileTransfer.download(url, this.file.externalRootDirectory + AppConstant.FileStoreDir + '/' + newFileName)
                  .then((entry) => {
                    message = entry.nativeURL;
                    resolve(message);
                  })
                  .catch((error) => {
                    reject(error);
                  })
              })
              // File does not exist yet, we can save normally
              .catch(err =>
                fileTransfer.download(url, this.file.externalRootDirectory + AppConstant.FileStoreDir + '/' + filename)
                  .then((entry) => {
                    message = entry.nativeURL;
                    resolve(message);
                  })
                  .catch((error) => {
                    reject(error);
                  })
              ))
          .catch(
            // Directory does not exists, create a new one
            err => this.file.createDir(this.file.externalRootDirectory, AppConstant.FileStoreDir, false)
              .then(response => {
                // console.log('New folder created:  ' + response.fullPath);
                fileTransfer.download(url, this.file.externalRootDirectory + AppConstant.FileStoreDir + '/' + filename)
                  .then((entry) => {
                    message = entry.nativeURL;
                    resolve(message);
                  })
                  .catch((error) => {
                    reject(error);
                  });

              }).catch(error => {
                // console.log('It was not possible to create the dir "' + AppConstant.FileStoreDir + '".\n Err: ' + error.message);
                reject(error);
              })
          );

      } else {
        const error = {
          message: 'Error while download',
          err: 'Not able to detect native device to download file'
        };
        reject(error);
      }


    });
  }

  downloadInIOS(fileUrl) {
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
  }

}