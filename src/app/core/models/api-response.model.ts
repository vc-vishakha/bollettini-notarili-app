export interface ApiResponseModel<T> {
  code: number;
  message: string;
  data: T;
  error?: any
}