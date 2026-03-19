import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from 'src/generated/prisma/client';
import { mapPrismaException } from './prisma-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpException: HttpException;

    if (exception instanceof HttpException) {
      httpException = exception;
    } else if (this.isPrismaException(exception)) {
      httpException = mapPrismaException(exception);
    } else {
      httpException = new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const status = httpException.getStatus();
    const exceptionResponse = httpException.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message;

    const error =
      typeof exceptionResponse === 'string'
        ? undefined
        : (exceptionResponse as any).error;

    response.status(status).json({
      statusCode: status,
      message,
      error,
    });
  }

  private isPrismaException(
    exception: unknown,
  ): exception is
    | Prisma.PrismaClientKnownRequestError
    | Prisma.PrismaClientValidationError
    | Prisma.PrismaClientInitializationError
    | Prisma.PrismaClientRustPanicError {
    return (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError ||
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientRustPanicError
    );
  }
}
