import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/config/base.entity';
import { UsersProjects } from '../../users/entities';
import { IProject } from '../interfaces/project.interface';

@Entity({ name: 'tbl_projects' })
export class Project extends BaseEntity implements IProject {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(
    (): typeof UsersProjects => UsersProjects,
    (usersProjects): Project => usersProjects.project,
  )
  usersInclude: UsersProjects[];
}
