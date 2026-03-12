import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService {
  constructor(private readonly configService: ConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>(
      'DATABASE_URL',
      'postgresql://postgres:change_me@localhost:5432/mydatabase',
    );
  }

  get jwt(): {
    access: { secret: string; expiresIn: string };
    refresh: { secret: string; expiresIn: string };
  } {
    return {
      access: {
        secret: this.configService.get<string>(
          'JWT_SECRET_KEY',
          'your_jwt_secret_key',
        ),
        expiresIn: this.configService.get<string>('ACCESS_EXPRITED_IN', '1h'),
      },
      refresh: {
        secret: this.configService.get<string>(
          'JWT_SECRET_KEY',
          'your_jwt_secret_key',
        ),
        expiresIn: this.configService.get<string>('REFRESH_EXPRITED_IN', '7d'),
      },
    };
  }
}
