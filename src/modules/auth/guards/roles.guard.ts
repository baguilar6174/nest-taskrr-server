import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {
  PUBLIC_KEY,
  ROLES,
  ROLES_KEY,
  ADMIN_KEY,
} from '../../../common/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;
    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );
    const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());
    const req = context.switchToHttp().getRequest();
    const { roleUser } = req;
    if (!roles) {
      if (!admin) {
        return true;
      } else if (admin && roleUser === admin) {
        return true;
      } else {
        throw new UnauthorizedException('No permission for this operation');
      }
    }
    if (roleUser === ROLES.ADMIN) return true;
    const isAuth = roles.some((role): boolean => role === roleUser);
    if (!isAuth) {
      throw new UnauthorizedException('No permission for this operation');
    }
    return true;
  }
}
