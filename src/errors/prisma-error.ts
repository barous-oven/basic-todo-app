import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';

export function mapPrismaException(exception: unknown): HttpException {
  if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P2002': {
        const target = Array.isArray(exception.meta?.target)
          ? exception.meta?.target.join(', ')
          : String(exception.meta?.modelName ?? 'field');

        return new ConflictException(`${target} already exists`);
      }

      case 'P2025':
        return new NotFoundException('Record not found');

      case 'P2003':
        return new BadRequestException('Related record does not exist');

      case 'P2014':
        return new BadRequestException('Invalid relation data');

      default:
        return new BadRequestException(exception.message);
    }
  }

  if (exception instanceof Prisma.PrismaClientValidationError) {
    return new BadRequestException('Invalid Prisma query');
  }

  if (exception instanceof Prisma.PrismaClientInitializationError) {
    return new InternalServerErrorException('Database connection failed');
  }

  if (exception instanceof Prisma.PrismaClientRustPanicError) {
    return new InternalServerErrorException('Database engine crashed');
  }

  return new InternalServerErrorException('Internal server error');
}
