import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './libs/database/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EnvConfigModule } from './config/env-config.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { JwtAccessStrategy } from './guards/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './guards/strategies/jwt-refresh.strategy';
import { TagsModule } from './modules/tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    EnvConfigModule,
    TasksModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}
