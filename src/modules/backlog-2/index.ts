import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { ProjectsController } from './projects/projects.controller';
import { TasksService } from './tasks/tasks.service';
import { ProjectsService } from './projects/projects.service';

/**
 * Story module for backlog-2 — synthesised by the AEGIS code-gen pipeline so the
 * generated controllers/providers are mounted by the application entrypoint.
 */
@Module({
  controllers: [TasksController, ProjectsController],
  providers: [TasksService, ProjectsService],
})
export class Backlog2Module {}
