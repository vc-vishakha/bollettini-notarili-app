import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponseModel, FileModel, Category, SingleFile } from 'src/app/core/models';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  searchApi = 'user/es-keyword-search';
  categoryApi = 'user/category';
  bookmarkApi = 'user/bookmark/create';
  fileFromIdApi = 'user/get-filename';
  setDownloadsApi = 'user/download/create';

  constructor(
    private httpClient: HttpClient,
  ) { }

  searchFiles(params: any): Observable<ApiResponseModel<FileModel[]>> {
    return this.httpClient.post<ApiResponseModel<FileModel[]>>(this.searchApi, params);
  }

  getCategoryList(): Observable<ApiResponseModel<Category[]>> {
    return this.httpClient.get<ApiResponseModel<Category[]>>(this.categoryApi);
  }

  bookmarkFile(params: any): Observable<ApiResponseModel<any>> {
    return this.httpClient.post<ApiResponseModel<any>>(this.bookmarkApi, params);
  }

  getFileFormId(params: any): Observable<ApiResponseModel<SingleFile>> {
    return this.httpClient.post<ApiResponseModel<SingleFile>>(this.fileFromIdApi, params);
  }

  setFileDownloads(params: any): Observable<ApiResponseModel<any>> {
    return this.httpClient.post<ApiResponseModel<any>>(this.setDownloadsApi, params);
  }
}
