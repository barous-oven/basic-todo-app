import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const payload = this.validateToken(token);
      (request as any).user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private validateToken(token: string): {
    userId: string;
    type: string;
  } {
    try {
      const payload = jwt.verify(
        token,
        this.configService.get<string>('JWT_SECRET_KEY', 'your_jwt_secret_key'),
      ) as {
        id: string;
        type: string;
      };

      if (payload.type !== 'access' && payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      return {
        userId: payload.id,
        type: payload.type,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
