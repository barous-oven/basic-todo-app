import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './errors/error-handling';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get<string>('PREFIX_API', '/api'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(configService.get<number>('PORT', 3000));

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
