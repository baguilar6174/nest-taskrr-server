import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/config/base.entity';
import { ACCESS_LEVELS } from '../../../common/constants';
import { Project } from '../../projects/entities/project.entity';
import { User } from './';

@Entity({ name: 'tbl_users_projects' })
export class UsersProjects extends BaseEntity {
  @Column({ name: 'access_level', enum: ACCESS_LEVELS })
  accessLevel: ACCESS_LEVELS;

  @ManyToOne(
    (): typeof User => User,
    (user): UsersProjects[] => user.projectsInclude,
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    (): typeof Project => Project,
    (project): UsersProjects[] => project.usersInclude,
  )
  @JoinColumn({ name: 'project_id' })
  project: Project;
}
