import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseModel } from 'src/app/core/models/api-response.model';
import { BookmarkedFileModel } from './../../core/models/bookmarks.model';

@Injectable({
  providedIn: 'root'
})
export class BookmarksService {

  bookmarkGetApi = 'user/bookmarks';
  deleteBookmarkApi = 'user/bookmark/update/';

  constructor(
    private httpClient: HttpClient
  ) { }

  getBookmarkList(): Observable<ApiResponseModel<BookmarkedFileModel[]>> {
    return this.httpClient.get<ApiResponseModel<BookmarkedFileModel[]>>(this.bookmarkGetApi);
  }

  removeBookmark(id: string, params: any): Observable<any> {
    return this.httpClient.put<ApiResponseModel<any>>(this.deleteBookmarkApi + id, params);
  }
}
