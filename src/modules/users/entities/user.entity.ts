import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/config/base.entity';
import { ROLES } from '../../../common/constants';
import { IUser } from '../interfaces/user.interface';
import { UsersProjects } from './';

@Entity({ name: 'tbl_users' })
export class User extends BaseEntity implements IUser {
  @Column({ type: 'text', name: 'first_name' })
  firstName: string;

  @Column({ type: 'text', name: 'last_name' })
  lastName: string;

  @Column()
  age: number;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', unique: true })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @OneToMany(
    (): typeof UsersProjects => UsersProjects,
    (usersProjects): User => usersProjects.user,
  )
  projectsInclude: UsersProjects[];
}
