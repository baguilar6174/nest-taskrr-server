import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { ACCESS_LEVELS } from '../../../common/constants';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../entities';

export class UserToProjectDto {
  @IsNotEmpty()
  @IsUUID()
  user: User;

  @IsNotEmpty()
  @IsUUID()
  project: Project;

  @IsNotEmpty()
  @IsEnum(ACCESS_LEVELS)
  accessLevel: ACCESS_LEVELS;
}
