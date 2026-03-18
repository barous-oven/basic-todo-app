import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        let response = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: 'Success',
          data,
        };

        if (data && data.meta && data.data) {
          response = {
            ...response,
            ...data,
          };
        }

        return response;
      }),
    );
  }
}
