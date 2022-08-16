import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export const RoleGuard = (...roles: Role[]): any => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const id = request?.user?.userId;
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new UnauthorizedException();
      }

      return roles.includes(user.role);
    }
  }

  return mixin(RoleGuardMixin);
};
