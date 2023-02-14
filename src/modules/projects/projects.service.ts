import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly datasource: DataSource,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectRepository.save(createProjectDto);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async findOne(id: string): Promise<Project> {
    const customQuery = this.projectRepository.createQueryBuilder('project');
    const project: Project = await customQuery
      .where({ id })
      .leftJoinAndSelect('project.usersInclude', 'usersInclude')
      .leftJoinAndSelect('usersInclude.user', 'user')
      .getOne();
    if (!project) throw new NotFoundException(`user not found`);
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project: Project = await this.projectRepository.preload({
      id,
      ...updateProjectDto,
    });
    if (!project) throw new NotFoundException(`project not found`);
    // Create query runner
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    await queryRunner.manager.save(project);
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return project;
  }

  async remove(id: string) {
    const project: Project = await this.findOne(id);
    await this.projectRepository.remove(project);
    return {
      message: `The '${project.name}' project has been deleted`,
    };
  }
}
