import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Session } from '@ory/kratos-client';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const req: Request & { session: Session } = context
      .switchToHttp()
      .getRequest();

    try {
      const response = await this.authService.api.toSession(
        undefined,
        req.headers.cookie,
      );
      req.session = response.data;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return next.handle();
  }
}
