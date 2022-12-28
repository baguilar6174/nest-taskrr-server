import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/config/base.entity';
import { IUser } from '../interfaces/user.interface';

@Entity({ name: 'tbl_users' })
export class User extends BaseEntity implements IUser {
  @Column({ type: 'text', name: 'first_name' })
  firstName: string;

  @Column({ type: 'text', name: 'last_name' })
  lastName: string;

  @Column({ type: 'number' })
  age: number;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  role: string;
}
