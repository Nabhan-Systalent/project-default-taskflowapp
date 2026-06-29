import { Injectable } from '@nestjs/common';
import { ProjectResponseDto } from '../dto';

@Injectable()
export class ProjectsService {
  private projects: ProjectResponseDto[] = [{ id: 'p1', name: 'Main Project' }];

  findAll(): ProjectResponseDto[] {
    return this.projects;
  }

  delete(id: string): void {
    this.projects = this.projects.filter(p => p.id !== id);
  }
}
