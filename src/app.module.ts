import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigService } from './config/envConfig.service';
import { PrismaModule } from './libs/database/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EnvConfigModule } from './config/envConfig.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    EnvConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
