import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/config/base.entity';
import { IProject } from '../interfaces/project.interface';

@Entity({ name: 'tbl_projects' })
export class Project extends BaseEntity implements IProject {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;
}
