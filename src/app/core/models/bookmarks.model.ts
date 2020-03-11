export interface BookmarkedFileModel {
  bookmarkFileId: {
    status: string;
    fileID: {
      _id: string;
      filePath: string;
    }
  }
  _id: string;
}