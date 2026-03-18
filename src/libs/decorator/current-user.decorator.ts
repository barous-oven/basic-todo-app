import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TUserPayload } from 'src/modules/auth/auth.type';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user as TUserPayload;

    return user;
  },
);
