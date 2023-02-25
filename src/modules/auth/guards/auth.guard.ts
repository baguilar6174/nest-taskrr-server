import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UsersService } from '../../users/users.service';
import { PUBLIC_KEY } from '../../../common/constants';
import { useToken } from '../../../common/utils/useToken';
import { IUseToken } from '../interfaces/auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;
    const req = context.switchToHttp().getRequest();
    const token = req.headers['token'];
    if (!token || Array.isArray(token)) {
      throw new UnauthorizedException('Invalid token');
    }
    const manageToken: IUseToken | string = useToken(token);
    if (typeof manageToken === 'string') {
      throw new UnauthorizedException(manageToken);
    }
    if (manageToken.isExpired) {
      throw new UnauthorizedException('Token expired');
    }
    const { sub } = manageToken;
    const user = await this.usersService.findOne(sub);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }
    req.idUser = user.id;
    req.roleUser = user.role;
    return true;
  }
}
