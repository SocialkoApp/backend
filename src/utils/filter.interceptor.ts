import {
  CallHandler,
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const PublicFilter = <T extends new (...args: any[]) => any>(
  entityClass: T,
  groups?: string[],
): any => {
  @Injectable()
  class PublicFilterMixin implements NestInterceptor {
    intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
      return next.handle().pipe(
        map((data) =>
          plainToClass(entityClass, data, {
            excludeExtraneousValues: true,
            groups,
          }),
        ),
      );
    }
  }

  return mixin(PublicFilterMixin);
};
