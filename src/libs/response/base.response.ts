export class BaseResponse<T> {
  data?: T;
  message?: string;

  constructor(data?: T, message?: string) {
    this.data = data;
    this.message = message;
  }

  static success<T>(data?: T, message?: string): BaseResponse<T> {
    return new BaseResponse<T>(data, message);
  }
}
