// status: string;
// _id: string;
// filePath: string;
// parentId: string;
// categoryId?: {
//   _id: string;
//   name: string;
// },
// updatedAt: string;
// createdAt: string;
// keywords: string[];
// pageNo: number;
export interface FileModel {
  _id: string;
  _source: {
    author: string;
    title: string;
    location: number;
    fileId: string;
    text: string;
    categoryId?: string[],
    isBookMarK?: string[],
    isDownload?: string[],
    _id?: string;
    filePath?: string;
    storedPath?: string;
  },
  highlight: {
    text: string[];
  },
  // categoryId?: string[],
}

export interface Category {
  _id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}

export interface SingleFile {
  _id: string;
  filePath: string;
}