import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  ACCESS_LEVEL_KEY,
  ADMIN_KEY,
  PUBLIC_KEY,
  ROLES,
  ROLES_KEY,
} from '../../../common/constants';
import { UsersService } from '../../users/users.service';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;
    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );

    const accessLevel = this.reflector.get<number>(
      ACCESS_LEVEL_KEY,
      context.getHandler(),
    );

    const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());
    const req = context.switchToHttp().getRequest();
    const { roleUser, idUser } = req;
    if (!accessLevel) {
      if (!roles) {
        if (!admin) {
          return true;
        } else if (admin && roleUser === admin) {
          return true;
        } else {
          throw new UnauthorizedException('No permission for this operation');
        }
      }
    }
    if (roleUser === ROLES.ADMIN) return true;
    const user = await this.usersService.findOne(idUser);
    const userExistsInProject = user.projectsInclude.find(
      (project): boolean => project.project.id === req.params.id,
    );
    if (!userExistsInProject) {
      throw new UnauthorizedException('No permission for this project');
    }
    if (accessLevel !== userExistsInProject.accessLevel) {
      throw new UnauthorizedException(
        'You do not have the required level of access',
      );
    }
    return true;
  }
}
