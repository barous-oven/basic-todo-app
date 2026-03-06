import { Response } from "express";
import { StatusCodes } from "http-status-codes";

class BaseResponse {
  static success<T>(res: Response, data: T) {
    return res.json({
      statusCode: StatusCodes.OK,
      success: true,
      data,
    });
  }
}

export default BaseResponse;