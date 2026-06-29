import { Injectable } from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  private projects: ProjectDto[] = [
    { id: '1', name: 'Alpha Project' },
    { id: '2', name: 'Beta Project' },
  ];

  async findAll(): Promise<ProjectDto[]> {
    return this.projects;
  }

  async remove(id: string): Promise<void> {
    this.projects = this.projects.filter((p) => p.id !== id);
  }
}
