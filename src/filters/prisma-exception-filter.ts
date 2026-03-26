import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionsFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const exceptionFilter = {
      statusCode: 400,
      message: 'Bad Request',
      error: 'BadRequestException',
    };

    switch (exception.code) {
      case 'P2002': {
        exceptionFilter.statusCode = 409;
        exceptionFilter.message = `Resource already exists`;
        exceptionFilter.error = 'ConflictException';
        break;
      }

      case 'P2025':
        exceptionFilter.statusCode = 404;
        exceptionFilter.message = 'Record not found';
        exceptionFilter.error = 'NotFoundException';
        break;

      case 'P2003':
        exceptionFilter.statusCode = 400;
        exceptionFilter.message = 'Related record does not exist';
        exceptionFilter.error = 'BadRequestException';
        break;

      case 'P2014':
        exceptionFilter.statusCode = 400;
        exceptionFilter.message = 'Invalid relation data';
        exceptionFilter.error = 'BadRequestException';
        break;

      default:
        exceptionFilter.statusCode = 400;
        exceptionFilter.message = exception.message;
        exceptionFilter.error = 'BadRequestException';
        break;
    }

    return response.status(exceptionFilter.statusCode).json(exceptionFilter);
  }
}
