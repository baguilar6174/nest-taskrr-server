import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserToProjectDto } from './dto/user-to-project.dto';
import { User, UsersProjects } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UsersProjects)
    private readonly userProjectRepository: Repository<UsersProjects>,
    private readonly datasource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      Number(process.env.HASH_SALT),
    );
    return this.userRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const customQuery = this.userRepository.createQueryBuilder('user');
    const user: User = await customQuery
      .where({ id })
      .leftJoinAndSelect('user.projectsInclude', 'projectsInclude')
      .leftJoinAndSelect('projectsInclude.project', 'project')
      .getOne();
    if (!user) throw new NotFoundException(`user not found`);
    return user;
  }

  async findBy({
    key,
    value,
  }: {
    key: keyof CreateUserDto;
    value: any;
  }): Promise<User> {
    const customQuery = this.userRepository.createQueryBuilder('user');
    const user: User = await customQuery
      .addSelect('user.password')
      .where({ [key]: value })
      .getOne();
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) throw new NotFoundException(`user not found`);
    // Create query runner
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await queryRunner.manager.save(user);
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return user;
  }

  async remove(id: string) {
    const user: User = await this.findOne(id);
    await this.userRepository.remove(user);
    return {
      message: `The '${user.firstName}' user has been deleted`,
    };
  }

  async addToProject(userToProjectDto: UserToProjectDto) {
    return this.userProjectRepository.save(userToProjectDto);
  }
}
