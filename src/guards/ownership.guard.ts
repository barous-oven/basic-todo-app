import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  mixin,
  Type,
} from '@nestjs/common';
import { PrismaService } from 'src/libs/database/prisma.service';
import { PrismaClient } from 'src/generated/prisma/client';

type ModelName = Exclude<keyof PrismaClient, `$${string}` | symbol>;

export function OwnerShipGuard(modelName: ModelName): Type<CanActivate> {
  @Injectable()
  class OwnerGuardMixin implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      const userId = request.user?.userId;
      const id = request.params?.id;

      if (!userId) {
        throw new ForbiddenException('Unauthorized');
      }

      if (!id) {
        throw new NotFoundException('Resource id is required');
      }

      const model: any = this.prisma[modelName];

      const record = await model.findUnique({
        where: { id },
        select: { createdBy: true },
      });

      if (!record) {
        throw new NotFoundException(`${modelName.toString()} not found`);
      }

      if (record.createdBy !== userId) {
        throw new ForbiddenException(
          `You are not owner of this ${modelName.toString()}`,
        );
      }

      return true;
    }
  }

  return mixin(OwnerGuardMixin);
}
