import { HttpStatus } from '@nestjs/common';

export class BaseResponse<T> {
  statusCode: HttpStatus;
  data?: T;
  message?: string;

  constructor(
    statusCode: HttpStatus = HttpStatus.OK,
    message: string,
    data?: T,
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  static success<T>(
    statusCode: HttpStatus,
    message: string,
    data?: T,
  ): BaseResponse<T> {
    const response = new BaseResponse<T>(statusCode, message, data);
    return response;
  }
}
