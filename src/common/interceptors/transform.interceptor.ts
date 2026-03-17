import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>();

        if (response.statusCode === 204) {
          return data;
        }

        if (Array.isArray(data)) {
          return {
            status: 'success',
            results: data.length,
            data,
          };
        }

        return {
          status: 'success',
          data,
        };
      }),
    );
  }
}
