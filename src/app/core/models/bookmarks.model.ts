export interface BookmarkedFileModel {
  bookmarkFileId: {
    status: string;
    fileID: {
      _id: string;
      filePath: string;
      userAddFileName: string;
    }
  }
  _id: string;
}